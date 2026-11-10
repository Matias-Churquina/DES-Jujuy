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
import { Remiseria } from '../../remiserias/entities/remiseria.entity';
import { Viaje } from '../../viajes/entities/viaje.entity';

export enum AutoEstado {
  DISPONIBLE = 'DISPONIBLE',
  EN_VIAJE = 'EN_VIAJE',
  EN_TALLER = 'EN_TALLER',
  INACTIVO = 'INACTIVO',
}

@Entity('autos')
export class Auto {
  @PrimaryGeneratedColumn('increment')
  idAuto: number;

  @Column({ type: 'integer', nullable: true })
  idChofer: number;

  @Column({ type: 'integer' })
  idRemiseria: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  patente: string;

  @Column({ type: 'varchar', length: 50 })
  marca: string;

  @Column({ type: 'varchar', length: 50 })
  modelo: string;

  @Column({ type: 'integer' })
  anio: number;

  @Column({ type: 'integer' })
  capacidadAsientos: number;

  @Column({ type: 'varchar', length: 20, default: AutoEstado.DISPONIBLE })
  estado: AutoEstado;

  @Column({ type: 'text', nullable: true })
  color: string;

  @Column({ type: 'json', nullable: true })
  foto: {
    url: string;
    publicId: string;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Chofer, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idChofer' })
  chofer?: Chofer;

  @ManyToOne(() => Remiseria, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idRemiseria' })
  remiseria: Remiseria;

  @OneToMany(() => Viaje, (viaje) => viaje.auto)
  viajes: Viaje[];
}
