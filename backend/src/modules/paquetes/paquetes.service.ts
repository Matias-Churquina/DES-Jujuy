import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Paquete, PaqueteEstado,
} from './entities/paquete.entity';
import { TrazabilidadPaquete } from '../trazabilidad/entities/trazabilidad-paquete.entity';
import { CreatePaqueteDto, EstadoPaqueteDto } from './dto/paquete.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

const TRANSICIONES: Record<PaqueteEstado, PaqueteEstado[]> = {
  [PaqueteEstado.PENDIENTE_RECOGIDA]: [PaqueteEstado.RECIBIDO, PaqueteEstado.CANCELADO],
  [PaqueteEstado.RECIBIDO]: [PaqueteEstado.ASIGNADO, PaqueteEstado.CANCELADO],
  [PaqueteEstado.ASIGNADO]: [PaqueteEstado.EN_TRANSITO, PaqueteEstado.INCIDENCIA, PaqueteEstado.CANCELADO],
  [PaqueteEstado.EN_TRANSITO]: [PaqueteEstado.ENTREGADO, PaqueteEstado.INCIDENCIA, PaqueteEstado.DEVUELTO],
  [PaqueteEstado.INCIDENCIA]: [PaqueteEstado.EN_TRANSITO, PaqueteEstado.DEVUELTO],
  [PaqueteEstado.ENTREGADO]: [],
  [PaqueteEstado.DEVUELTO]: [],
  [PaqueteEstado.CANCELADO]: [],
};

@Injectable()
export class PaquetesService {
  constructor(
    @InjectRepository(Paquete)
    private paqueteRepository: Repository<Paquete>,
    @InjectRepository(TrazabilidadPaquete)
    private trazabilidadRepository: Repository<TrazabilidadPaquete>,
    private websocketGateway: WebsocketGateway,
  ) {}

  private generarCodigo(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = 'DES-';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  }

  async create(dto: CreatePaqueteDto): Promise<Paquete> {
    let codigo = this.generarCodigo();
    while (await this.paqueteRepository.findOne({ where: { codigoSeguimiento: codigo } })) {
      codigo = this.generarCodigo();
    }

    const paquete = this.paqueteRepository.create({
      ...dto,
      codigoSeguimiento: codigo,
      estado: PaqueteEstado.PENDIENTE_RECOGIDA,
      estadoPago: 'PENDIENTE' as any,
    });
    const saved = await this.paqueteRepository.save(paquete);

    await this.registrarTrazabilidad(saved.idPaquete, 'CREADO', PaqueteEstado.PENDIENTE_RECOGIDA, {
      latitud: dto.origen.latitud,
      longitud: dto.origen.longitud,
      observaciones: 'Envío registrado en el sistema',
    });

    return saved;
  }

  private async registrarTrazabilidad(
    idPaquete: number,
    estadoAnterior: string,
    estadoNuevo: string,
    extra: { latitud?: number; longitud?: number; observaciones?: string; usuarioResponsable?: string } = {},
  ) {
    const t = this.trazabilidadRepository.create({
      idPaquete,
      estadoAnterior,
      estadoNuevo,
      latitud: extra.latitud ?? null,
      longitud: extra.longitud ?? null,
      observaciones: extra.observaciones ?? null,
      usuarioResponsable: extra.usuarioResponsable ?? null,
    });
    await this.trazabilidadRepository.save(t);
  }

  /** Tracking público por código — sin auth. El código actúa como credencial. */
  async track(codigo: string) {
    const paquete = await this.paqueteRepository.findOne({
      where: { codigoSeguimiento: codigo.toUpperCase().trim() },
      relations: ['trazabilidad', 'remiseria'],
    });
    if (!paquete) throw new NotFoundException('Código de seguimiento no encontrado');

    const ultimoGps = [...(paquete.trazabilidad || [])]
      .filter((t) => t.latitud != null)
      .sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime())[0];

    return {
      codigoSeguimiento: paquete.codigoSeguimiento,
      estado: paquete.estado,
      prioridad: paquete.prioridad,
      descripcion: paquete.descripcion,
      origenDireccion: paquete.origen?.direccion,
      destinoDireccion: paquete.destino?.direccion,
      remiseria: paquete.remiseria?.nombre,
      createdAt: paquete.createdAt,
      ubicacionActual: ultimoGps ? { latitud: ultimoGps.latitud, longitud: ultimoGps.longitud, fechaHora: ultimoGps.fechaHora } : null,
      timeline: (paquete.trazabilidad || [])
        .sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime())
        .map((t) => ({
          estado: t.estadoNuevo,
          fecha: t.fechaHora,
          observaciones: t.observaciones,
          latitud: t.latitud,
          longitud: t.longitud,
        })),
    };
  }

  findByPasajero(idPasajero: number): Promise<Paquete[]> {
    return this.paqueteRepository.find({
      where: { idPasajeroRemitente: idPasajero },
      relations: ['trazabilidad'],
      order: { createdAt: 'DESC' },
    });
  }

  findByChofer(idChofer: number): Promise<Paquete[]> {
    return this.paqueteRepository.find({
      where: { idChofer },
      relations: ['pasajeroRemitente', 'pasajeroRemitente.usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  findAll(idRemiseria?: number): Promise<Paquete[]> {
    return this.paqueteRepository.find({
      where: idRemiseria ? { idRemiseria } : {},
      relations: ['chofer', 'chofer.usuario', 'pasajeroRemitente', 'pasajeroRemitente.usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  /** Supervisor marca la recepción física del paquete en la remisería.
   *  Solo después de recibido se puede asignar chofer (evita asignar
   *  paquetes que el remitente nunca dejó). */
  async marcarRecibido(idPaquete: number): Promise<Paquete> {
    const paquete = await this.paqueteRepository.findOne({ where: { idPaquete } });
    if (!paquete) throw new NotFoundException('Paquete no encontrado');
    if (paquete.estado !== PaqueteEstado.PENDIENTE_RECOGIDA) {
      throw new BadRequestException(`El paquete está en estado ${paquete.estado}`);
    }

    const anterior = paquete.estado;
    paquete.estado = PaqueteEstado.RECIBIDO;
    const saved = await this.paqueteRepository.save(paquete);

    await this.registrarTrazabilidad(idPaquete, anterior, PaqueteEstado.RECIBIDO, {
      observaciones: 'Paquete recibido físicamente en la remisería',
    });
    this.emitir(paquete.codigoSeguimiento, saved);
    return saved;
  }

  async asignar(idPaquete: number, idChofer: number): Promise<Paquete> {
    const paquete = await this.paqueteRepository.findOne({ where: { idPaquete } });
    if (!paquete) throw new NotFoundException('Paquete no encontrado');
    if (paquete.estado !== PaqueteEstado.RECIBIDO) {
      throw new BadRequestException(
        paquete.estado === PaqueteEstado.PENDIENTE_RECOGIDA
          ? 'Primero marque el paquete como recibido físicamente'
          : `No se puede asignar en estado ${paquete.estado}`,
      );
    }

    const anterior = paquete.estado;
    paquete.idChofer = idChofer;
    paquete.estado = PaqueteEstado.ASIGNADO;
    const saved = await this.paqueteRepository.save(paquete);

    await this.registrarTrazabilidad(idPaquete, anterior, PaqueteEstado.ASIGNADO, {
      observaciones: `Asignado al chofer #${idChofer}`,
    });
    this.emitir(paquete.codigoSeguimiento, saved);
    return saved;
  }

  async cambiarEstado(idPaquete: number, dto: EstadoPaqueteDto): Promise<Paquete> {
    const paquete = await this.paqueteRepository.findOne({ where: { idPaquete } });
    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    const permitidos = TRANSICIONES[paquete.estado] || [];
    if (!permitidos.includes(dto.estado)) {
      throw new BadRequestException(`No se puede pasar de ${paquete.estado} a ${dto.estado}`);
    }

    const anterior = paquete.estado;
    paquete.estado = dto.estado;
    const saved = await this.paqueteRepository.save(paquete);

    await this.registrarTrazabilidad(idPaquete, anterior, dto.estado, {
      latitud: dto.latitud,
      longitud: dto.longitud,
      observaciones: dto.observaciones,
    });
    this.emitir(paquete.codigoSeguimiento, saved);
    return saved;
  }

  private emitir(codigo: string, paquete: Paquete) {
    this.websocketGateway.emitToRoom(
      `paquete_${codigo}`,
      'paquete_actualizado',
      { codigoSeguimiento: codigo, estado: paquete.estado, timestamp: new Date().toISOString() },
    );
  }
}
