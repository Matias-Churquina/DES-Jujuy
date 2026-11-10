import { IsInt, IsEnum, IsPositive, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagoCanal } from '../entities/reserva.entity';

export class CreateReservaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idPasajero: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  idViaje: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  cantidadAsientos: number;

  @ApiProperty({ enum: PagoCanal, example: PagoCanal.EFECTIVO })
  @IsEnum(PagoCanal)
  canalPago: PagoCanal;
}
