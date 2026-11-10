import {
  IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsInt, IsPositive, IsObject, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaqueteEstado, PaquetePrioridad } from '../entities/paquete.entity';

export class PuntoEntregaDto {
  @ApiPropertyOptional() @IsOptional() @IsNumber() latitud?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() longitud?: number;
  @ApiProperty() @IsString() @IsNotEmpty() direccion: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contacto?: string;
  @ApiProperty() @IsString() @IsNotEmpty() telefono: string;
}

export class CreatePaqueteDto {
  @ApiProperty() @IsInt() @IsPositive() idPasajeroRemitente: number;
  @ApiProperty() @IsInt() @IsPositive() idRemiseria: number;
  @ApiProperty({ example: 'Documentos en sobre' }) @IsString() @IsNotEmpty() @MaxLength(200) descripcion: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contenido?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() peso?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() dimensiones?: string;
  @ApiPropertyOptional({ enum: PaquetePrioridad }) @IsOptional() @IsEnum(PaquetePrioridad) prioridad?: PaquetePrioridad;
  @ApiProperty() @IsNumber() @IsPositive() tarifa: number;
  @ApiProperty({ type: PuntoEntregaDto }) @IsObject() origen: PuntoEntregaDto;
  @ApiProperty({ type: PuntoEntregaDto }) @IsObject() destino: PuntoEntregaDto;
  @ApiPropertyOptional() @IsOptional() @IsString() notas?: string;
}

export class AsignarPaqueteDto {
  @ApiProperty() @IsInt() @IsPositive() idChofer: number;
}

export class EstadoPaqueteDto {
  @ApiProperty({ enum: PaqueteEstado }) @IsEnum(PaqueteEstado) estado: PaqueteEstado;
  @ApiPropertyOptional() @IsOptional() @IsNumber() latitud?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() longitud?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() observaciones?: string;
}
