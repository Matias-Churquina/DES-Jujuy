import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Usuario } from '../users/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener usuario actual' })
  @ApiResponse({ status: 200, description: 'Usuario actual' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getProfile(@Req() req: any): Promise<Usuario> {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  async logout() {
    return { status: 1, msg: 'Sesión cerrada' };
  }

  // DEBUG ENDPOINT - Temporal para diagnosticar
  @Post('debug-login')
  @ApiOperation({ summary: 'Debug login (temporal)' })
  async debugLogin(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    console.log('=== DEBUG LOGIN ===');
    console.log('Email recibido:', email);
    console.log('Password recibido:', password);

    // Buscar usuario
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['chofer', 'pasajero', 'admin'],
    });

    if (!usuario) {
      return {
        status: 0,
        msg: 'Usuario no encontrado',
        debug: {
          email,
          userFound: false,
        },
      };
    }

    console.log('Usuario encontrado:', {
      id: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      passwordHash: usuario.passwordHash?.substring(0, 20) + '...',
    });

    // Verificar si está activo
    if (!usuario.activo) {
      return {
        status: 0,
        msg: 'Usuario inactivo',
        debug: {
          email,
          userFound: true,
          activo: usuario.activo,
        },
      };
    }

    // Comparar password
    try {
      const isPasswordValid = await usuario.comparePassword(password);
      console.log('Password válido:', isPasswordValid);

      if (!isPasswordValid) {
        // Comparar manualmente
        const manualCheck = await bcrypt.compare(password, usuario.passwordHash);
        console.log('Manual bcrypt compare:', manualCheck);
        
        return {
          status: 0,
          msg: 'Password incorrecto',
          debug: {
            email,
            userFound: true,
            activo: usuario.activo,
            comparePassword: isPasswordValid,
            manualCompare: manualCheck,
            passwordHash: usuario.passwordHash?.substring(0, 30) + '...',
          },
        };
      }

      // Generar token
      const token = this.authService['generateToken'](usuario);
      const response = {
        status: 1,
        msg: 'Login exitoso',
        token,
        usuario: this.authService['usuarioToJSON'](usuario),
        rol: usuario.rol,
      };

      console.log('Login exitoso');
      return response;
    } catch (error) {
      console.error('Error en comparePassword:', error);
      return {
        status: 0,
        msg: 'Error en autenticación',
        debug: {
          email,
          error: error.message,
        },
      };
    }
  }
}
