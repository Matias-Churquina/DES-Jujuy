import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Remiseria } from '../../remiserias/entities/remiseria.entity';

export enum AdminEstado {
  ACTIVO = 'ACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
  INACTIVO = 'INACTIVO',
}

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('increment')
  idAdmin: number;

  @Column({ type: 'integer' })
  idUsuario: number;

  @Column({ type: 'integer', nullable: true })
  idRemiseria: number;

  @Column({
    type: 'enum',
    enum: AdminEstado,
    default: AdminEstado.ACTIVO,
  })
  estadoAdmin: AdminEstado;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => Usuario, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario' })
  usuario: Usuario;

  @OneToOne(() => Remiseria, { nullable: true })
  @JoinColumn({ name: 'idRemiseria' })
  remiseria?: Remiseria;
}
