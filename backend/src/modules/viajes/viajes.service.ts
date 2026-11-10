import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Viaje, ViajeEstado } from './entities/viaje.entity';
import { CreateViajeDto } from './dto/viaje.dto';
import { Chofer } from '../choferes/entities/chofer.entity';
import { Auto } from '../autos/entities/auto.entity';

const TRANSICIONES_VALIDAS: Record<ViajeEstado, ViajeEstado[]> = {
  [ViajeEstado.ABIERTO]: [ViajeEstado.EN_CURSO, ViajeEstado.CANCELADO],
  [ViajeEstado.EN_CURSO]: [ViajeEstado.FINALIZADO, ViajeEstado.CANCELADO],
  [ViajeEstado.COMPLETO]: [ViajeEstado.EN_CURSO, ViajeEstado.CANCELADO],
  [ViajeEstado.FINALIZADO]: [],
  [ViajeEstado.CANCELADO]: [],
};

@Injectable()
export class ViajesService {
  constructor(
    @InjectRepository(Viaje)
    private viajeRepository: Repository<Viaje>,
    @InjectRepository(Chofer)
    private choferRepository: Repository<Chofer>,
    @InjectRepository(Auto)
    private autoRepository: Repository<Auto>,
  ) {}

  async findAll(): Promise<Viaje[]> {
    return this.viajeRepository.find({
      relations: ['chofer', 'chofer.usuario', 'auto', 'reservas', 'origen', 'destino'],
      order: { fechaSalida: 'DESC', horaSalida: 'DESC' },
    });
  }

  async findByChofer(idChofer: number): Promise<Viaje[]> {
    return this.viajeRepository.find({
      where: { idChofer },
      relations: ['chofer', 'auto', 'reservas', 'origen', 'destino'],
      order: { fechaSalida: 'DESC', horaSalida: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Viaje> {
    const viaje = await this.viajeRepository.findOne({
      where: { idViaje: id },
      relations: ['chofer', 'auto', 'reservas', 'origen', 'destino'],
    });

    if (!viaje) {
      throw new NotFoundException(`Viaje con ID ${id} no encontrado`);
    }

    return viaje;
  }

  async create(dto: CreateViajeDto): Promise<Viaje> {
    const chofer = await this.choferRepository.findOne({
      where: { idChofer: dto.idChofer },
    });
    if (!chofer) throw new NotFoundException('Chofer no encontrado');

    const auto = await this.autoRepository.findOne({
      where: { idAuto: dto.idAuto },
    });
    if (!auto) throw new NotFoundException('Auto no encontrado');
    if (dto.asientosDisponibles > auto.capacidadAsientos) {
      throw new BadRequestException(
        `El auto tiene ${auto.capacidadAsientos} asientos`,
      );
    }
    if (dto.idOrigen === dto.idDestino) {
      throw new BadRequestException('Origen y destino no pueden ser iguales');
    }
    if (new Date(dto.fechaSalida) < new Date(new Date().toDateString())) {
      throw new BadRequestException('La fecha de salida no puede ser pasada');
    }

    const viaje = this.viajeRepository.create({
      idChofer: dto.idChofer,
      idAuto: dto.idAuto,
      idOrigen: dto.idOrigen,
      idDestino: dto.idDestino,
      fechaSalida: new Date(dto.fechaSalida),
      horaSalida: dto.horaSalida,
      tarifaPorAsiento: dto.tarifaPorAsiento,
      asientosDisponibles: dto.asientosDisponibles,
      estadoViaje: ViajeEstado.ABIERTO,
    });
    const saved = await this.viajeRepository.save(viaje);
    return this.findOne(saved.idViaje);
  }

  async updateEstado(id: number, estadoViaje: ViajeEstado): Promise<Viaje> {
    const viaje = await this.viajeRepository.findOne({
      where: { idViaje: id },
    });
    if (!viaje) throw new NotFoundException(`Viaje con ID ${id} no encontrado`);

    const permitidos = TRANSICIONES_VALIDAS[viaje.estadoViaje] || [];
    if (!permitidos.includes(estadoViaje)) {
      throw new BadRequestException(
        `No se puede pasar de ${viaje.estadoViaje} a ${estadoViaje}`,
      );
    }

    await this.viajeRepository.update(id, { estadoViaje });
    return this.findOne(id);
  }

  async findDisponibles(
    idOrigen: number,
    idDestino: number,
  ): Promise<Viaje[]> {
    return this.viajeRepository.find({
      where: {
        idOrigen,
        idDestino,
        estadoViaje: ViajeEstado.ABIERTO,
      },
      relations: ['chofer', 'chofer.usuario', 'auto', 'origen', 'destino'],
      order: { fechaSalida: 'ASC', horaSalida: 'ASC' },
    });
  }

  async actualizarAsientosDisponibles(
    id: number,
    asientosDisponibles: number,
  ): Promise<Viaje> {
    await this.viajeRepository.update(id, { asientosDisponibles });
    return this.findOne(id);
  }
}
