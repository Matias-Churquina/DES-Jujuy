import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DestinosService } from './destinos.service';
import { CreateDestinoDto, UpdateDestinoDto } from './dto/destino.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('destinos')
@Controller('destinos')
export class DestinosController {
  constructor(private destinosService: DestinosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar destinos activos (o todos con ?todos=true)' })
  @ApiQuery({ name: 'todos', required: false })
  findAll(@Query('todos') todos?: string) {
    return this.destinosService.findAll(todos === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener destino por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.destinosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear destino (admin)' })
  create(@Body() dto: CreateDestinoDto) {
    return this.destinosService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar destino (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDestinoDto,
  ) {
    return this.destinosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar destino (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.destinosService.remove(id);
  }
}
