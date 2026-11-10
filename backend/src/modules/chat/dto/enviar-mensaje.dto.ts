import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnviarMensajeDto {
  @ApiProperty({ example: 'Estoy en la esquina de Belgrano y Alvear' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  texto: string;
}
