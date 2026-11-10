import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Chofer } from '../../choferes/entities/chofer.entity';
import { Pasajero } from '../../pasajeros/entities/pasajero.entity';
import { Admin } from '../../users/entities/admin.entity';

export enum UserRole {
  PASAJERO = 'PASAJERO',
  CHOFER = 'CHOFER',
  ADMIN = 'ADMIN',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  idUsuario: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'varchar', length: 50 })
  apellido: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PASAJERO,
  })
  rol: UserRole;

  @Column({ nullable: true })
  googleId: string;

  @Column({ type: 'json', nullable: true })
  fotoPerfil: {
    url: string;
    publicId: string;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => Chofer, (chofer) => chofer.usuario, { cascade: true })
  chofer?: Chofer;

  @OneToOne(() => Pasajero, (pasajero) => pasajero.usuario, { cascade: true })
  pasajero?: Pasajero;

  @OneToOne(() => Admin, (admin) => admin.usuario, { cascade: true })
  admin?: Admin;

  private SALT_ROUNDS = 10;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Solo hashear si NO es ya un hash bcrypt (empieza con $2)
    // Esto evita re-hashear en updates que no tocan el password
    if (this.passwordHash && !this.passwordHash.startsWith('$2')) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, this.SALT_ROUNDS);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    if (!this.passwordHash) return false;
    return bcrypt.compare(plainPassword, this.passwordHash);
  }

  toJSON() {
    const { passwordHash, ...rest } = this;
    return rest;
  }
}
