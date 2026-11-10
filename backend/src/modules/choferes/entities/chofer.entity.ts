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
import { Remiseria } from '../../remiserias/entities/remiseria.entity';
import { Auto } from '../../autos/entities/auto.entity';
import { Viaje } from '../../viajes/entities/viaje.entity';

export enum ChoferEstado {
  DISPONIBLE = 'DISPONIBLE',
  EN_VIAJE = 'EN_VIAJE',
  DESCANSO = 'DESCANSO',
  SUSPENDIDO = 'SUSPENDIDO',
  INACTIVO = 'INACTIVO',
  ELIMINADO = 'ELIMINADO',
}

@Entity('choferes')
export class Chofer {
  @PrimaryGeneratedColumn('increment')
  idChofer: number;

  @Column({ type: 'integer' })
  idUsuario: number;

  @Column({ type: 'integer' })
  idRemiseria: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  licenciaConducir: string;

  @Column({
    type: 'enum',
    enum: ChoferEstado,
    default: ChoferEstado.DISPONIBLE,
  })
  estadoChofer: ChoferEstado;

  @Column({ type: 'date' })
  fechaHabilitacion: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  calificacion: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precision: number;

  @Column({ type: 'timestamp', nullable: true })
  ultimaActualizacionUbicacion: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Usuario, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @ManyToOne(() => Remiseria, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idRemiseria' })
  remiseria: Remiseria;

  @OneToMany(() => Auto, (auto) => auto.chofer)
  autos: Auto[];

  @OneToMany(() => Viaje, (viaje) => viaje.chofer)
  viajes: Viaje[];
}
