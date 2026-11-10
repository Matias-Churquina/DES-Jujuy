import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Chofer } from '../../choferes/entities/chofer.entity';
import { Auto } from '../../autos/entities/auto.entity';
import { Admin } from '../../users/entities/admin.entity';

export enum RemiseriaEstado {
  ACTIVA = 'ACTIVA',
  SUSPENDIDA = 'SUSPENDIDA',
  INACTIVA = 'INACTIVA',
}

@Entity('remiserias')
export class Remiseria {
  @PrimaryGeneratedColumn('increment')
  idRemiseria: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  cuit: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({
    type: 'enum',
    enum: RemiseriaEstado,
    default: RemiseriaEstado.ACTIVA,
  })
  estado: RemiseriaEstado;

  @Column({ type: 'json', nullable: true })
  configuracion: {
    tarifaBase: number;
    tarifaPorKm: number;
    maxAutosPorChofer: number;
    maxAsientosPorAuto: number;
    tiempoCancelacionMinutos: number;
  };

  @Column({ type: 'json', nullable: true })
  zonaOperacion: {
    latitud: number;
    longitud: number;
    radioKm: number;
    ciudades: string[];
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Chofer, (chofer) => chofer.remiseria)
  choferes: Chofer[];

  @OneToMany(() => Auto, (auto) => auto.remiseria)
  autos: Auto[];

  @OneToMany(() => Admin, (admin) => admin.remiseria)
  admins: Admin[];
}
