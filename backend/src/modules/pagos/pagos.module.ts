import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Reserva } from '../reservas/entities/reserva.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva]), WebsocketModule],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
