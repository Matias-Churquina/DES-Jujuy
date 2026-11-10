import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, UserRole } from '../users/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Chofer, ChoferEstado } from '../choferes/entities/chofer.entity';
import { Pasajero, PasajeroEstado } from '../pasajeros/entities/pasajero.entity';
import { Admin, AdminEstado } from '../users/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Chofer)
    private choferRepository: Repository<Chofer>,
    @InjectRepository(Pasajero)
    private pasajeroRepository: Repository<Pasajero>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, rol = UserRole.PASAJERO, ...rest } = registerDto;

    // Verificar si el usuario existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      ...rest,
      email,
      passwordHash: password,
      rol,
    });

    await this.usuarioRepository.save(usuario);

    // Crear perfil según rol
    await this.crearPerfil(usuario);

    // Generar token
    const token = this.generateToken(usuario);

    return {
      status: 1,
      msg: 'Usuario registrado correctamente',
      token,
      usuario: this.usuarioToJSON(usuario),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['chofer', 'pasajero', 'admin'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await usuario.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    const token = this.generateToken(usuario);

    return {
      status: 1,
      msg: 'Login exitoso',
      token,
      usuario: this.usuarioToJSON(usuario),
      rol: usuario.rol,
      idChofer: usuario.chofer?.idChofer,
      idPasajero: usuario.pasajero?.idPasajero,
      idAdmin: usuario.admin?.idAdmin,
    };
  }

  private generateToken(usuario: Usuario): string {
    const payload = {
      sub: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
    };

    return this.jwtService.sign(payload);
  }

  private async crearPerfil(usuario: Usuario) {
    const { rol, idUsuario } = usuario;

    switch (rol) {
      case UserRole.CHOFER:
        const chofer = this.choferRepository.create({
          idUsuario,
          licenciaConducir: `LIC-${Date.now()}`,
          estadoChofer: ChoferEstado.DISPONIBLE,
          fechaHabilitacion: new Date(),
          calificacion: 0,
        });
        await this.choferRepository.save(chofer);
        break;

      case UserRole.PASAJERO:
        const pasajero = this.pasajeroRepository.create({
          idUsuario,
          estadoPasajero: PasajeroEstado.ACTIVO,
          calificacion: 0,
          cantidadReservas: 0,
        });
        await this.pasajeroRepository.save(pasajero);
        break;

      case UserRole.ADMIN:
        const admin = this.adminRepository.create({
          idUsuario,
          estadoAdmin: AdminEstado.ACTIVO,
        });
        await this.adminRepository.save(admin);
        break;
    }
  }

  private usuarioToJSON(usuario: Usuario) {
    const { passwordHash, ...rest } = usuario as any;
    delete rest.SALT_ROUNDS;
    return rest;
  }

  async validateUser(payload: any): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      where: { idUsuario: payload.sub },
      relations: ['chofer', 'pasajero', 'admin'],
    });
  }
}
