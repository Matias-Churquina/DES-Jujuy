import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/usuario.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  apellido: string;

  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  telefono: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PASAJERO })
  @IsEnum(UserRole)
  @IsOptional()
  rol?: UserRole;
}
