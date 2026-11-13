import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { Reserva, ReservaEstado } from '../reservas/entities/reserva.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Mensaje)
    private mensajeRepository: Repository<Mensaje>,
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
    private websocketGateway: WebsocketGateway,
  ) {}

  // Devuelve { idUsuarioPasajero, idUsuarioChofer } y lanza si no es participante
  private async participantes(idReserva: number, idUsuario: number) {
    const reserva = await this.reservaRepository.findOne({
      where: { idReserva },
      relations: ['pasajero', 'viaje', 'viaje.chofer'],
    });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');

    const idUsuarioPasajero = reserva.pasajero?.idUsuario;
    const idUsuarioChofer = reserva.viaje?.chofer?.idUsuario;

    if (idUsuario !== idUsuarioPasajero && idUsuario !== idUsuarioChofer) {
      throw new ForbiddenException('No sos participante de este chat');
    }
    return { reserva, idUsuarioPasajero, idUsuarioChofer };
  }

  async listar(idReserva: number, idUsuario: number) {
    await this.participantes(idReserva, idUsuario);
    return this.mensajeRepository.find({
      where: { idReserva },
      order: { createdAt: 'ASC' },
      take: 200,
    });
  }

  async enviar(idReserva: number, idUsuario: number, texto: string) {
    const { reserva, idUsuarioPasajero, idUsuarioChofer } =
      await this.participantes(idReserva, idUsuario);

    if (reserva.estadoReserva === ReservaEstado.CANCELADA) {
      throw new BadRequestException('No se puede chatear en una reserva cancelada');
    }

    const idReceptor =
      idUsuario === idUsuarioPasajero ? idUsuarioChofer : idUsuarioPasajero;

    const mensaje = this.mensajeRepository.create({
      idReserva,
      idEmisor: idUsuario,
      idReceptor,
      texto,
      leido: false,
    });
    const guardado = await this.mensajeRepository.save(mensaje);

    this.websocketGateway.emitToRoom(
      `reserva_${idReserva}`,
      'mensaje_nuevo',
      guardado,
    );
    return guardado;
  }

  async marcarLeidos(idReserva: number, idUsuario: number) {
    await this.participantes(idReserva, idUsuario);
    await this.mensajeRepository.update(
      { idReserva, idReceptor: idUsuario, leido: false },
      { leido: true },
    );
    return { ok: true };
  }

  // Cantidad de no leídos por reserva (para badge en la lista)
  async noLeidos(idReserva: number, idUsuario: number) {
    const count = await this.mensajeRepository.count({
      where: { idReserva, idReceptor: idUsuario, leido: false },
    });
    return { noLeidos: count };
  }

  // Lista de conversaciones del usuario: reservas donde es pasajero o chofer,
  // con último mensaje y cantidad de no leídos.
  async conversaciones(idUsuario: number) {
    const reservas = await this.reservaRepository
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.pasajero', 'pasajero')
      .innerJoinAndSelect('pasajero.usuario', 'pUsuario')
      .innerJoinAndSelect('r.viaje', 'viaje')
      .innerJoinAndSelect('viaje.chofer', 'chofer')
      .innerJoinAndSelect('chofer.usuario', 'cUsuario')
      .leftJoinAndSelect('viaje.origen', 'origen')
      .leftJoinAndSelect('viaje.destino', 'destino')
      .where('pUsuario.idUsuario = :idUsuario', { idUsuario })
      .orWhere('cUsuario.idUsuario = :idUsuario', { idUsuario })
      .orderBy('r.idReserva', 'DESC')
      .getMany();

    return Promise.all(
      reservas.map(async (r) => {
        const ultimo = await this.mensajeRepository.findOne({
          where: { idReserva: r.idReserva },
          order: { createdAt: 'DESC' },
        });
        const noLeidos = await this.mensajeRepository.count({
          where: { idReserva: r.idReserva, idReceptor: idUsuario, leido: false },
        });
        const esPasajero = r.pasajero?.idUsuario === idUsuario;
        const otro = esPasajero ? r.viaje?.chofer?.usuario : r.pasajero?.usuario;
        return {
          idReserva: r.idReserva,
          estadoReserva: r.estadoReserva,
          otroUsuario: otro
            ? { nombre: otro.nombre, apellido: otro.apellido }
            : null,
          viaje: r.viaje
            ? {
                origen: r.viaje.origen?.nombre,
                destino: r.viaje.destino?.nombre,
              }
            : null,
          ultimoMensaje: ultimo
            ? { texto: ultimo.texto, createdAt: ultimo.createdAt }
            : null,
          noLeidos,
        };
      }),
    );
  }
}
