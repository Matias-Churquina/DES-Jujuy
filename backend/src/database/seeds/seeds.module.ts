import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoSeed } from './demo.seed';
import { Usuario } from '../../modules/users/entities/usuario.entity';
import { Remiseria } from '../../modules/remiserias/entities/remiseria.entity';
import { Chofer } from '../../modules/choferes/entities/chofer.entity';
import { Pasajero } from '../../modules/pasajeros/entities/pasajero.entity';
import { Auto } from '../../modules/autos/entities/auto.entity';
import { Viaje } from '../../modules/viajes/entities/viaje.entity';
import { Destino } from '../../modules/destinos/entities/destino.entity';
import { Admin } from '../../modules/users/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Admin,
      Remiseria,
      Chofer,
      Pasajero,
      Auto,
      Viaje,
      Destino,
    ]),
  ],
  providers: [DemoSeed],
  exports: [DemoSeed],
})
export class SeedsModule {}
