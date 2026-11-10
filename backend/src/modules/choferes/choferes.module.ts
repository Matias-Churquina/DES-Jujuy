import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChoferesController } from './choferes.controller';
import { ChoferesService } from './choferes.service';
import { Chofer } from './entities/chofer.entity';
import { Viaje } from '../viajes/entities/viaje.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chofer, Viaje]), WebsocketModule],
  controllers: [ChoferesController],
  providers: [ChoferesService],
  exports: [ChoferesService],
})
export class ChoferesModule {}
