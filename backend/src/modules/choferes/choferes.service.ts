import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chofer } from './entities/chofer.entity';
import { Viaje, ViajeEstado } from '../viajes/entities/viaje.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ChoferesService {
  constructor(
    @InjectRepository(Chofer)
    private choferRepository: Repository<Chofer>,
    @InjectRepository(Viaje)
    private viajeRepository: Repository<Viaje>,
    private websocketGateway: WebsocketGateway,
  ) {}

  async findAll(): Promise<Chofer[]> {
    return this.choferRepository.find({
      relations: ['usuario', 'remiseria', 'autos'],
    });
  }

  async findOne(id: number): Promise<Chofer> {
    const chofer = await this.choferRepository.findOne({
      where: { idChofer: id },
      relations: ['usuario', 'remiseria', 'autos'],
    });

    if (!chofer) {
      throw new NotFoundException(`Chofer con ID ${id} no encontrado`);
    }

    return chofer;
  }

  async updateEstado(id: number, estadoChofer: string): Promise<Chofer> {
    await this.choferRepository.update(id, { estadoChofer: estadoChofer as any });
    return this.findOne(id);
  }

  async updateUbicacion(
    id: number,
    latitud: number,
    longitud: number,
    precision?: number,
  ): Promise<Chofer> {
    await this.choferRepository.update(id, {
      latitud,
      longitud,
      precision,
      ultimaActualizacionUbicacion: new Date(),
    });

    // Si el chofer tiene un viaje EN_CURSO, broadcast a los pasajeros suscritos
    const viajeEnCurso = await this.viajeRepository.findOne({
      where: { idChofer: id, estadoViaje: ViajeEstado.EN_CURSO },
    });
    if (viajeEnCurso) {
      this.websocketGateway.emitToRoom(
        `viaje_${viajeEnCurso.idViaje}`,
        'ubicacion_chofer',
        {
          idViaje: viajeEnCurso.idViaje,
          idChofer: id,
          latitud,
          longitud,
          timestamp: new Date().toISOString(),
        },
      );
    }

    return this.findOne(id);
  }

  async getViajesDelChofer(idChofer: number): Promise<Viaje[]> {
    return this.viajeRepository.find({
      where: { idChofer },
      relations: ['reservas', 'auto', 'chofer', 'origen', 'destino', 'chofer.usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRemiseria(idRemiseria: number): Promise<Chofer[]> {
    return this.choferRepository.find({
      where: { idRemiseria },
      relations: ['usuario', 'autos'],
    });
  }
}
