import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ViajesService } from './viajes.service';
import { CreateViajeDto, UpdateViajeEstadoDto } from './dto/viaje.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('viajes')
@Controller('viajes')
export class ViajesController {
  constructor(private viajesService: ViajesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los viajes' })
  async findAll() {
    return this.viajesService.findAll();
  }

  @Get('disponibles')
  @ApiOperation({ summary: 'Buscar viajes disponibles por origen/destino (IDs) y fecha opcional' })
  async findDisponibles(
    @Query('origen', ParseIntPipe) origen: number,
    @Query('destino', ParseIntPipe) destino: number,
    @Query('fecha') fecha?: string,
  ) {
    return this.viajesService.findDisponibles(origen, destino, fecha);
  }

  @Get('chofer/:idChofer')
  @ApiOperation({ summary: 'Viajes de un chofer' })
  async findByChofer(@Param('idChofer', ParseIntPipe) idChofer: number) {
    return this.viajesService.findByChofer(idChofer);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener viaje por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.viajesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo viaje' })
  async create(@Body() dto: CreateViajeDto) {
    return this.viajesService.create(dto);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar estado del viaje (valida transición)' })
  async updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateViajeEstadoDto,
  ) {
    return this.viajesService.updateEstado(id, dto.estado);
  }

  @Post(':id/actualizar-asientos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar asientos disponibles' })
  async actualizarAsientos(
    @Param('id', ParseIntPipe) id: number,
    @Body('asientosDisponibles') asientosDisponibles: number,
  ) {
    return this.viajesService.actualizarAsientosDisponibles(
      id,
      asientosDisponibles,
    );
  }
}
