import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DemoSeed } from './database/seeds/demo.seed';

// Importar todas las entidades necesarias
import { Usuario } from './modules/users/entities/usuario.entity';
import { Remiseria } from './modules/remiserias/entities/remiseria.entity';
import { Chofer } from './modules/choferes/entities/chofer.entity';
import { Pasajero } from './modules/pasajeros/entities/pasajero.entity';
import { Auto } from './modules/autos/entities/auto.entity';
import { Viaje } from './modules/viajes/entities/viaje.entity';
import { Reserva } from './modules/reservas/entities/reserva.entity';
import { Paquete } from './modules/paquetes/entities/paquete.entity';
import { TrazabilidadPaquete } from './modules/trazabilidad/entities/trazabilidad-paquete.entity';
import { TurnoChofer } from './modules/choferes/entities/turno-chofer.entity';
import { Auditoria } from './modules/auditoria/entities/auditoria.entity';
import { Admin } from './modules/users/entities/admin.entity';
import { Destino } from './modules/destinos/entities/destino.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'des_db',
      entities: [
        Usuario,
        Admin,
        Remiseria,
        Chofer,
        Pasajero,
        Auto,
        Viaje,
        Reserva,
        Destino,
        Paquete,
        TrazabilidadPaquete,
        TurnoChofer,
        Auditoria,
      ],
      synchronize: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([
      Usuario,
      Admin,
      Remiseria,
      Chofer,
      Pasajero,
      Auto,
      Viaje,
      Reserva,
      Destino,
      Paquete,
      TrazabilidadPaquete,
      TurnoChofer,
      Auditoria,
    ]),
  ],
  providers: [DemoSeed],
})
class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seed = app.get(DemoSeed);

  try {
    await seed.seed();
    console.log('✅ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }

  await app.close();
}

bootstrap();
