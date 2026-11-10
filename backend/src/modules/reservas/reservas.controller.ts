import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('reservas')
@Controller('reservas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservasController {
  constructor(private reservasService: ReservasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada' })
  @ApiResponse({ status: 400, description: 'Sin asientos o viaje no abierto' })
  @ApiResponse({ status: 409, description: 'Ya tiene reserva activa en el viaje' })
  create(@Body() dto: CreateReservaDto) {
    return this.reservasService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reserva por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }

  @Get('viaje/:idViaje')
  @ApiOperation({ summary: 'Reservas de un viaje' })
  findByViaje(@Param('idViaje', ParseIntPipe) idViaje: number) {
    return this.reservasService.findByViaje(idViaje);
  }

  @Get('pasajero/:idPasajero')
  @ApiOperation({ summary: 'Reservas de un pasajero' })
  findByPasajero(@Param('idPasajero', ParseIntPipe) idPasajero: number) {
    return this.reservasService.findByPasajero(idPasajero);
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar reserva (devuelve asientos)' })
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.cancelar(id);
  }

  @Patch(':id/pago-efectivo')
  @ApiOperation({ summary: 'Registrar pago en efectivo (chofer cobra)' })
  marcarPagoEfectivo(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.marcarPagoEfectivo(id);
  }
}
