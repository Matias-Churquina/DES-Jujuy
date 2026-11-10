import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RemiseriasService } from './remiserias.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('remiserias')
@Controller('remiserias')
export class RemiseriasController {
  constructor(private remiseriasService: RemiseriasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las remiserías' })
  async findAll() {
    return this.remiseriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener remisería por ID' })
  async findOne(@Param('id') id: string) {
    return this.remiseriasService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva remisería' })
  async create(@Body() remiseriaData: any) {
    return this.remiseriasService.create(remiseriaData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar remisería' })
  async update(@Param('id') id: string, @Body() remiseriaData: any) {
    return this.remiseriasService.update(+id, remiseriaData);
  }
}
