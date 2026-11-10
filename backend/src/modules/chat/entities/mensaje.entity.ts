import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('mensajes')
export class Mensaje {
  @PrimaryGeneratedColumn('increment')
  idMensaje: number;

  @Column({ type: 'integer' })
  idReserva: number;

  @Column({ type: 'integer' })
  idEmisor: number;

  @Column({ type: 'integer' })
  idReceptor: number;

  @Column({ type: 'text' })
  texto: string;

  @Column({ type: 'boolean', default: false })
  leido: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Reserva, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idReserva' })
  reserva: Reserva;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'idEmisor' })
  emisor: Usuario;
}
