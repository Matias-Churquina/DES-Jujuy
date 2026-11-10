import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn('increment')
  idAuditoria: number;

  @Column({ type: 'varchar', length: 100 })
  tablaAfectada: string;

  @Column({ type: 'varchar', length: 20 })
  accion: string;

  @Column({ type: 'varchar', length: 50 })
  registroId: string;

  @Column({ type: 'jsonb', nullable: true })
  valoresAnteriores: any;

  @Column({ type: 'jsonb', nullable: true })
  valoresNuevos: any;

  @Column({ type: 'varchar', length: 100, default: 'Sistema' })
  usuarioResponsable: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
