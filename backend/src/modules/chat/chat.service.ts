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
}
