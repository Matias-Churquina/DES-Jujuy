import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Mensaje } from './entities/mensaje.entity';
import { Reserva } from '../reservas/entities/reserva.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mensaje, Reserva]),
    WebsocketModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
