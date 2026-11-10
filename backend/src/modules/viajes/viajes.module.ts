import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajesController } from './viajes.controller';
import { ViajesService } from './viajes.service';
import { Viaje } from './entities/viaje.entity';
import { Chofer } from '../choferes/entities/chofer.entity';
import { Auto } from '../autos/entities/auto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Viaje, Chofer, Auto])],
  controllers: [ViajesController],
  providers: [ViajesService],
  exports: [ViajesService],
})
export class ViajesModule {}
