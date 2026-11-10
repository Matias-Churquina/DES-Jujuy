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
import { Usuario } from '../../users/entities/usuario.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';

export enum PasajeroEstado {
  ACTIVO = 'ACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
  BLOQUEADO = 'BLOQUEADO',
  ELIMINADO = 'ELIMINADO',
}

@Entity('pasajeros')
export class Pasajero {
  @PrimaryGeneratedColumn('increment')
  idPasajero: number;

  @Column({ type: 'integer' })
  idUsuario: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  calificacion: number;

  @Column({ type: 'integer', default: 0 })
  cantidadReservas: number;

  @Column({
    type: 'enum',
    enum: PasajeroEstado,
    default: PasajeroEstado.ACTIVO,
  })
  estadoPasajero: PasajeroEstado;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precision: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @OneToMany(() => Reserva, (reserva) => reserva.pasajero)
  reservas: Reserva[];
}
