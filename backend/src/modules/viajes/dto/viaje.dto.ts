import {
  IsInt,
  IsPositive,
  IsNumber,
  IsDateString,
  IsString,
  Matches,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ViajeEstado } from '../entities/viaje.entity';

export class CreateViajeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idChofer: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idAuto: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idOrigen: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  idDestino: number;

  @ApiProperty({ example: '2026-11-10' })
  @IsDateString()
  fechaSalida: string;

  @ApiProperty({ example: '08:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'horaSalida debe tener formato HH:mm',
  })
  horaSalida: string;

  @ApiProperty({ example: 800 })
  @IsNumber()
  @IsPositive()
  tarifaPorAsiento: number;

  @ApiProperty({ example: 4, minimum: 1 })
  @IsInt()
  @Min(1)
  asientosDisponibles: number;
}

export class UpdateViajeEstadoDto {
  @ApiProperty({ enum: ViajeEstado })
  @IsEnum(ViajeEstado)
  estado: ViajeEstado;
}
