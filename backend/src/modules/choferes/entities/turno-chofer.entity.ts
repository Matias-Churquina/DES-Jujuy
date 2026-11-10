import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Chofer } from './chofer.entity';
import { Auto } from '../../autos/entities/auto.entity';

@Entity('turnos_chofer')
export class TurnoChofer {
  @PrimaryGeneratedColumn('increment')
  idTurno: number;

  @Column({ type: 'integer' })
  idChofer: number;

  @Column({ type: 'integer' })
  idAuto: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Chofer, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idChofer' })
  chofer: Chofer;

  @ManyToOne(() => Auto, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idAuto' })
  auto: Auto;
}
