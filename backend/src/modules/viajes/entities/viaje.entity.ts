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
import { Chofer } from '../../choferes/entities/chofer.entity';
import { Auto } from '../../autos/entities/auto.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Destino } from '../../destinos/entities/destino.entity';

export enum ViajeEstado {
  ABIERTO = 'ABIERTO',
  COMPLETO = 'COMPLETO',
  EN_CURSO = 'EN_CURSO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

@Entity('viajes')
export class Viaje {
  @PrimaryGeneratedColumn('increment')
  idViaje: number;

  @Column({ type: 'integer' })
  idChofer: number;

  @Column({ type: 'integer' })
  idAuto: number;

  @Column({ type: 'integer' })
  idOrigen: number;

  @Column({ type: 'integer' })
  idDestino: number;

  @Column({ type: 'date' })
  fechaSalida: Date;

  @Column({ type: 'time' })
  horaSalida: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tarifaPorAsiento: number;

  @Column({ type: 'integer' })
  asientosDisponibles: number;

  @Column({
    type: 'enum',
    enum: ViajeEstado,
    default: ViajeEstado.ABIERTO,
  })
  estadoViaje: ViajeEstado;

  @Column({ type: 'json', nullable: true })
  ruta: {
    distanciaKm: number;
    duracionMinutos: number;
    puntos: Array<{ latitud: number; longitud: number }>;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Chofer, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idChofer' })
  chofer: Chofer;

  @ManyToOne(() => Auto, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idAuto' })
  auto: Auto;

  @OneToMany(() => Reserva, (reserva) => reserva.viaje)
  reservas: Reserva[];

  @ManyToOne(() => Destino, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idOrigen' })
  origen: Destino;

  @ManyToOne(() => Destino, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idDestino' })
  destino: Destino;
}
