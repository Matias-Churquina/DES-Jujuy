import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RemiseriasModule } from './modules/remiserias/remiserias.module';
import { ChoferesModule } from './modules/choferes/choferes.module';
import { ViajesModule } from './modules/viajes/viajes.module';
import { ReservasModule } from './modules/reservas/reservas.module';
import { DestinosModule } from './modules/destinos/destinos.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaquetesModule } from './modules/paquetes/paquetes.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { SeedsModule } from './database/seeds/seeds.module';

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
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
    }),
    AuthModule,
    UsersModule,
    RemiseriasModule,
    ChoferesModule,
    ViajesModule,
    ReservasModule,
    DestinosModule,
    PagosModule,
    PaquetesModule,
    ChatModule,
    WebsocketModule,
    SeedsModule,
  ],
})
export class AppModule {}
