import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Remiseria } from '../../remiserias/entities/remiseria.entity';
import { Chofer } from '../../choferes/entities/chofer.entity';
import { Pasajero } from '../../pasajeros/entities/pasajero.entity';
import { TrazabilidadPaquete } from '../../trazabilidad/entities/trazabilidad-paquete.entity';

export enum PaqueteEstado {
  PENDIENTE_RECOGIDA = 'PENDIENTE_RECOGIDA',
  RECIBIDO = 'RECIBIDO',
  ASIGNADO = 'ASIGNADO',
  EN_TRANSITO = 'EN_TRANSITO',
  ENTREGADO = 'ENTREGADO',
  INCIDENCIA = 'INCIDENCIA',
  DEVUELTO = 'DEVUELTO',
  CANCELADO = 'CANCELADO',
}

export enum PaquetePrioridad {
  NORMAL = 'NORMAL',
  URGENTE = 'URGENTE',
  FRAGIL = 'FRAGIL',
}

export enum PagoPaqueteEstado {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  REEMBOLSADO = 'REEMBOLSADO',
}

@Entity('paquetes')
export class Paquete {
  @PrimaryGeneratedColumn('increment')
  idPaquete: number;

  @Column({ type: 'integer' })
  idRemiseria: number;

  @Column({ type: 'integer', nullable: true })
  idChofer: number;

  @Column({ type: 'integer' })
  idPasajeroRemitente: number;

  @Column({ type: 'integer', nullable: true })
  idPasajeroDestinatario: number;

  @Column({ type: 'varchar', length: 200 })
  descripcion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dimensiones: string; // "20x30x40"

  @Column({ type: 'text', nullable: true })
  contenido: string;

  @Column({
    type: 'enum',
    enum: PaqueteEstado,
    default: PaqueteEstado.PENDIENTE_RECOGIDA,
  })
  estado: PaqueteEstado;

  @Column({
    type: 'enum',
    enum: PaquetePrioridad,
    default: PaquetePrioridad.NORMAL,
  })
  prioridad: PaquetePrioridad;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tarifa: number;

  @Column({
    type: 'enum',
    enum: PagoPaqueteEstado,
    default: PagoPaqueteEstado.PENDIENTE,
  })
  estadoPago: PagoPaqueteEstado;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fotoUrl: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigoSeguimiento: string; // Like "PER-123456"

  @Column({ type: 'json', nullable: true })
  origen: {
    latitud: number;
    longitud: number;
    direccion: string;
    contacto: string;
    telefono: string;
  };

  @Column({ type: 'json', nullable: true })
  destino: {
    latitud: number;
    longitud: number;
    direccion: string;
    contacto: string;
    telefono: string;
  };

  @Column({ type: 'varchar', length: 100, nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Remiseria, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idRemiseria' })
  remiseria: Remiseria;

  @ManyToOne(() => Chofer, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idChofer' })
  chofer?: Chofer;

  @ManyToOne(() => Pasajero, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idPasajeroRemitente' })
  pasajeroRemitente: Pasajero;

  @ManyToOne(() => Pasajero, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idPasajeroDestinatario' })
  pasajeroDestinatario?: Pasajero;

  @OneToMany(() => TrazabilidadPaquete, (trazabilidad) => trazabilidad.paquete)
  trazabilidad: TrazabilidadPaquete[];
}
