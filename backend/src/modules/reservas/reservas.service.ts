import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Reserva,
  ReservaEstado,
  PagoEstado,
  PagoCanal,
} from './entities/reserva.entity';
import { Viaje, ViajeEstado } from '../viajes/entities/viaje.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    @InjectRepository(Viaje)
    private viajeRepository: Repository<Viaje>,
    private dataSource: DataSource,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(dto: CreateReservaDto): Promise<Reserva> {
    // Transacción para evitar condiciones de carrera en asientos
    return this.dataSource.transaction(async (manager) => {
      // FOR UPDATE no puede aplicarse sobre LEFT JOINs (lado nulable).
      // Las relaciones no se usan acá: el lock va solo sobre la fila del viaje.
      const viaje = await manager.findOne(Viaje, {
        where: { idViaje: dto.idViaje },
        lock: { mode: 'pessimistic_write' }, // Lock para evitar sobreventa
      });

      if (!viaje) {
        throw new NotFoundException('Viaje no encontrado');
      }

      if (viaje.estadoViaje !== ViajeEstado.ABIERTO) {
        throw new BadRequestException('El viaje no está abierto a reservas');
      }

      if (viaje.asientosDisponibles < dto.cantidadAsientos) {
        throw new BadRequestException(
          `Solo quedan ${viaje.asientosDisponibles} asientos disponibles`,
        );
      }

      // Verificar que el pasajero no tenga reserva activa en este viaje
      const reservaExistente = await manager.findOne(Reserva, {
        where: {
          idPasajero: dto.idPasajero,
          idViaje: dto.idViaje,
          estadoReserva: ReservaEstado.CONFIRMADA,
        },
      });

      if (reservaExistente) {
        throw new ConflictException('Ya tienes una reserva activa en este viaje');
      }

      const importeTotal =
        Number(viaje.tarifaPorAsiento) * dto.cantidadAsientos;

      const reserva = manager.create(Reserva, {
        idPasajero: dto.idPasajero,
        idViaje: dto.idViaje,
        cantidadAsientos: dto.cantidadAsientos,
        importeTotal,
        estadoReserva: ReservaEstado.CONFIRMADA,
        estadoPago:
          dto.canalPago === PagoCanal.EFECTIVO
            ? PagoEstado.PENDIENTE
            : PagoEstado.PENDIENTE,
        canalPago: dto.canalPago,
      });

      const saved = await manager.save(Reserva, reserva);

      // Decrementar asientos
      viaje.asientosDisponibles -= dto.cantidadAsientos;
      if (viaje.asientosDisponibles === 0) {
        viaje.estadoViaje = ViajeEstado.COMPLETO;
      }
      await manager.save(Viaje, viaje);

      // Emitir eventos websocket (fuera de la transacción sería mejor, pero funciona)
      this.websocketGateway.emitToRoom(
        `viaje_${dto.idViaje}`,
        `reserva_creada_viaje_${dto.idViaje}`,
        { idReserva: saved.idReserva, idViaje: dto.idViaje },
      );
      this.websocketGateway.emitToRoom(
        `viaje_${dto.idViaje}`,
        `asientos_actualizados_viaje_${dto.idViaje}`,
        {
          idViaje: dto.idViaje,
          asientosDisponibles: viaje.asientosDisponibles,
        },
      );

      return saved;
    });
  }

  async cancelar(idReserva: number): Promise<Reserva> {
    return this.dataSource.transaction(async (manager) => {
      // Sin relations: el viaje se bloquea aparte más abajo y FOR UPDATE
      // falla si se combina con LEFT JOINs.
      const reserva = await manager.findOne(Reserva, {
        where: { idReserva },
        lock: { mode: 'pessimistic_write' },
      });

      if (!reserva) {
        throw new NotFoundException('Reserva no encontrada');
      }

      if (reserva.estadoReserva === ReservaEstado.CANCELADA) {
        throw new BadRequestException('La reserva ya está cancelada');
      }

      if (reserva.estadoReserva === ReservaEstado.UTILIZADA) {
        throw new BadRequestException('No se puede cancelar una reserva utilizada');
      }

      reserva.estadoReserva = ReservaEstado.CANCELADA;
      const saved = await manager.save(Reserva, reserva);

      // Devolver asientos al viaje
      const viaje = await manager.findOne(Viaje, {
        where: { idViaje: reserva.idViaje },
        lock: { mode: 'pessimistic_write' },
      });

      if (viaje) {
        viaje.asientosDisponibles += reserva.cantidadAsientos;
        if (viaje.estadoViaje === ViajeEstado.COMPLETO) {
          viaje.estadoViaje = ViajeEstado.ABIERTO;
        }
        await manager.save(Viaje, viaje);

        this.websocketGateway.emitToRoom(
          `viaje_${reserva.idViaje}`,
          `asientos_actualizados_viaje_${reserva.idViaje}`,
          {
            idViaje: reserva.idViaje,
            asientosDisponibles: viaje.asientosDisponibles,
          },
        );
      }

      this.websocketGateway.emitToRoom(
        `reserva_${idReserva}`,
        `reserva_cancelada_${idReserva}`,
        { idReserva },
      );

      return saved;
    });
  }

  async findByPasajero(idPasajero: number): Promise<Reserva[]> {
    return this.reservaRepository.find({
      where: { idPasajero },
      relations: ['viaje', 'viaje.origen', 'viaje.destino', 'viaje.chofer', 'viaje.chofer.usuario', 'viaje.auto'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByViaje(idViaje: number): Promise<Reserva[]> {
    return this.reservaRepository.find({
      where: { idViaje },
      relations: ['pasajero', 'pasajero.usuario'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(idReserva: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { idReserva },
      relations: ['viaje', 'viaje.origen', 'viaje.destino', 'pasajero', 'pasajero.usuario', 'viaje.chofer', 'viaje.chofer.usuario', 'viaje.auto'],
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    return reserva;
  }

  async marcarPagoEfectivo(idReserva: number): Promise<Reserva> {
    const reserva = await this.findOne(idReserva);
    if (reserva.estadoPago === PagoEstado.PAGADO) {
      throw new BadRequestException('El pago ya fue registrado');
    }
    reserva.estadoPago = PagoEstado.PAGADO;
    reserva.fechaPago = new Date();
    const saved = await this.reservaRepository.save(reserva);

    this.websocketGateway.emitToRoom(
      `reserva_${idReserva}`,
      `pago_confirmado_reserva_${idReserva}`,
      { idReserva, estadoPago: saved.estadoPago },
    );

    return saved;
  }
}
