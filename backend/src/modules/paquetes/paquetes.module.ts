import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paquete } from './entities/paquete.entity';
import { TrazabilidadPaquete } from '../trazabilidad/entities/trazabilidad-paquete.entity';
import { PaquetesService } from './paquetes.service';
import { PaquetesController } from './paquetes.controller';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paquete, TrazabilidadPaquete]),
    WebsocketModule,
  ],
  controllers: [PaquetesController],
  providers: [PaquetesService],
})
export class PaquetesModule {}
