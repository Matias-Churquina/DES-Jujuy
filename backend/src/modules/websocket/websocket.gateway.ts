import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: 'des',
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>(); // socketId -> userId

  handleConnection(client: Socket) {
    console.log(`[WEBSOCKET] Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[WEBSOCKET] Cliente desconectado: ${client.id}`);
    this.clients.delete(client.id);
  }

  // NOTA: JwtAuthGuard (HTTP) no funciona sobre mensajes WS (el handshake no
  // lleva Authorization header). TODO: implementar guard WS que valide el
  // token pasado en socket.handshake.auth.
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { userId: string; type: string; id?: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.clients.set(client.id, data.userId);

    if (data.type === 'pasajero') {
      client.join(`pasajero_${data.id}`);
    } else if (data.type === 'chofer') {
      client.join(`chofer_${data.id}`);
    } else if (data.type === 'viaje') {
      client.join(`viaje_${data.id}`);
    } else if (data.type === 'reserva') {
      client.join(`reserva_${data.id}`);
    }

    console.log(`[WEBSOCKET] Usuario ${data.userId} se unió a ${data.type}_${data.id}`);
  }

  @SubscribeMessage('leave')
  handleLeave(
    @MessageBody() data: { type: string; id?: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.type === 'pasajero' && data.id) {
      client.leave(`pasajero_${data.id}`);
    } else if (data.type === 'chofer' && data.id) {
      client.leave(`chofer_${data.id}`);
    } else if (data.type === 'viaje' && data.id) {
      client.leave(`viaje_${data.id}`);
    } else if (data.type === 'reserva' && data.id) {
      client.leave(`reserva_${data.id}`);
    }
  }

  // Métodos para emitir eventos desde el backend
  emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
