import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pasajero } from '../../pasajeros/entities/pasajero.entity';
import { Viaje } from '../../viajes/entities/viaje.entity';

export enum ReservaEstado {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
  UTILIZADA = 'UTILIZADA',
  NO_PRESENTADO = 'NO_PRESENTADO',
}

export enum PagoEstado {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  REEMBOLSADO = 'REEMBOLSADO',
}

export enum PagoCanal {
  LINK = 'LINK',
  QR = 'QR',
  EFECTIVO = 'EFECTIVO',
}

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn('increment')
  idReserva: number;

  @Column({ type: 'integer' })
  idPasajero: number;

  @Column({ type: 'integer' })
  idViaje: number;

  @Column({ type: 'integer' })
  cantidadAsientos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  importeTotal: number;

  @Column({
    type: 'enum',
    enum: ReservaEstado,
    default: ReservaEstado.PENDIENTE,
  })
  estadoReserva: ReservaEstado;

  @Column({
    type: 'enum',
    enum: PagoEstado,
    default: PagoEstado.PENDIENTE,
  })
  estadoPago: PagoEstado;

  @Column({
    type: 'enum',
    enum: PagoCanal,
    nullable: true,
  })
  canalPago: PagoCanal;

  @Column({ type: 'varchar', length: 100, nullable: true })
  codigoPagoMercadoPago: string;

  @Column({ type: 'timestamp', nullable: true })
  fechaPago: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Pasajero, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idPasajero' })
  pasajero: Pasajero;

  @ManyToOne(() => Viaje, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idViaje' })
  viaje: Viaje;
}
