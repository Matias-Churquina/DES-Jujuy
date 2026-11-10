import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaquetesService } from './paquetes.service';
import { CreatePaqueteDto, AsignarPaqueteDto, EstadoPaqueteDto } from './dto/paquete.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('paquetes')
@Controller('paquetes')
export class PaquetesController {
  constructor(private paquetesService: PaquetesService) {}

  // PÚBLICO: tracking por código (la credencial es el propio código)
  @Get('track/:codigo')
  @ApiOperation({ summary: 'Seguimiento público por código de ticket' })
  track(@Param('codigo') codigo: string) {
    return this.paquetesService.track(codigo);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear envío de paquete' })
  create(@Body() dto: CreatePaqueteDto) {
    return this.paquetesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar paquetes (admin, opcional ?idRemiseria)' })
  findAll(@Query('idRemiseria') idRemiseria?: number) {
    return this.paquetesService.findAll(idRemiseria);
  }

  @Get('pasajero/:idPasajero')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Envíos de un pasajero' })
  findByPasajero(@Param('idPasajero', ParseIntPipe) id: number) {
    return this.paquetesService.findByPasajero(id);
  }

  @Get('chofer/:idChofer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Paquetes asignados a un chofer' })
  findByChofer(@Param('idChofer', ParseIntPipe) id: number) {
    return this.paquetesService.findByChofer(id);
  }

  @Patch(':id/recibir')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar paquete como recibido físicamente (supervisor)' })
  recibir(@Param('id', ParseIntPipe) id: number) {
    return this.paquetesService.marcarRecibido(id);
  }

  @Patch(':id/asignar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Asignar chofer a un paquete' })
  asignar(@Param('id', ParseIntPipe) id: number, @Body() dto: AsignarPaqueteDto) {
    return this.paquetesService.asignar(id, dto.idChofer);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar estado del paquete (con GPS opcional)' })
  cambiarEstado(@Param('id', ParseIntPipe) id: number, @Body() dto: EstadoPaqueteDto) {
    return this.paquetesService.cambiarEstado(id, dto);
  }
}
