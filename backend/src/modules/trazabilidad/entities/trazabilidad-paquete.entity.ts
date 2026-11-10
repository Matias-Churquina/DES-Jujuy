import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Paquete } from '../../paquetes/entities/paquete.entity';

@Entity('trazabilidad_paquetes')
export class TrazabilidadPaquete {
  @PrimaryGeneratedColumn('increment')
  idTrazabilidad: number;

  @Column({ type: 'integer' })
  idPaquete: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precision: number;

  @Column({ type: 'varchar', length: 50 })
  estadoAnterior: string;

  @Column({ type: 'varchar', length: 50 })
  estadoNuevo: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  usuarioResponsable: string;

  @CreateDateColumn({ name: 'fecha_hora' })
  fechaHora: Date;

  // Relaciones
  @ManyToOne(() => Paquete, (paquete) => paquete.trazabilidad, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'idPaquete' })
  paquete: Paquete;
}
