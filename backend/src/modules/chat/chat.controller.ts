import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { EnviarMensajeDto } from './dto/enviar-mensaje.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversaciones')
  @ApiOperation({ summary: 'Conversaciones del usuario (último mensaje + no leídos)' })
  conversaciones(@Req() req: any) {
    return this.chatService.conversaciones(req.user.idUsuario);
  }

  @Get('reserva/:idReserva')
  @ApiOperation({ summary: 'Historial de mensajes de una reserva' })
  listar(
    @Param('idReserva', ParseIntPipe) idReserva: number,
    @Req() req: any,
  ) {
    return this.chatService.listar(idReserva, req.user.idUsuario);
  }

  @Post('reserva/:idReserva')
  @ApiOperation({ summary: 'Enviar mensaje en el chat de la reserva' })
  enviar(
    @Param('idReserva', ParseIntPipe) idReserva: number,
    @Body() dto: EnviarMensajeDto,
    @Req() req: any,
  ) {
    return this.chatService.enviar(idReserva, req.user.idUsuario, dto.texto);
  }

  @Patch('reserva/:idReserva/leer')
  @ApiOperation({ summary: 'Marcar mensajes como leídos' })
  leer(
    @Param('idReserva', ParseIntPipe) idReserva: number,
    @Req() req: any,
  ) {
    return this.chatService.marcarLeidos(idReserva, req.user.idUsuario);
  }

  @Get('reserva/:idReserva/no-leidos')
  noLeidos(
    @Param('idReserva', ParseIntPipe) idReserva: number,
    @Req() req: any,
  ) {
    return this.chatService.noLeidos(idReserva, req.user.idUsuario);
  }
}
