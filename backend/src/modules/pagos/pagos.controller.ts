import {
  Controller,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('pagos')
@Controller('pagos')
export class PagosController {
  constructor(private pagosService: PagosService) {}

  @Post('preferencia/:idReserva')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear preferencia de Checkout Pro para una reserva' })
  crearPreferencia(@Param('idReserva', ParseIntPipe) idReserva: number) {
    return this.pagosService.crearPreferencia(idReserva);
  }

  // Público: MercadoPago llama acá sin JWT
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook de notificaciones de MercadoPago' })
  webhook(@Body() body: any, @Query() query: any) {
    // Responder 200 inmediato; el procesamiento corre async en segundo plano.
    // Si se procesa antes de responder, MP marca el webhook como fallido
    // cuando algo tarda o falla (SDK, DB, etc).
    this.pagosService.procesarNotificacion(body, query).catch(() => {});
    return { received: true };
  }
}
