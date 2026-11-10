import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChoferesService } from './choferes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('choferes')
@Controller('choferes')
export class ChoferesController {
  constructor(private choferesService: ChoferesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los choferes' })
  async findAll() {
    return this.choferesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener chofer por ID' })
  async findOne(@Param('id') id: string) {
    return this.choferesService.findOne(+id);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar estado del chofer' })
  async updateEstado(
    @Param('id') id: string,
    @Body('estadoChofer') estadoChofer: string,
  ) {
    return this.choferesService.updateEstado(+id, estadoChofer);
  }

  @Patch(':id/ubicacion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar ubicación GPS del chofer' })
  async updateUbicacion(
    @Param('id') id: string,
    @Body() ubicacion: { latitud: number; longitud: number; precision?: number },
  ) {
    return this.choferesService.updateUbicacion(
      +id,
      ubicacion.latitud,
      ubicacion.longitud,
      ubicacion.precision,
    );
  }

  @Get(':id/viajes')
  @ApiOperation({ summary: 'Obtener viajes del chofer' })
  async getViajesDelChofer(@Param('id') id: string) {
    return this.choferesService.getViajesDelChofer(+id);
  }
}
