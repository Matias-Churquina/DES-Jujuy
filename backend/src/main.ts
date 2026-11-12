import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Destino } from './modules/destinos/entities/destino.entity';
import { DemoSeed } from './database/seeds/demo.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefijo global
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('DES API')
    .setDescription('API de Destino Express Service - Sistema de remises multi-tenant')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación')
    .addTag('users', 'Usuarios')
    .addTag('remiserias', 'Remiserías')
    .addTag('choferes', 'Choferes')
    .addTag('pasajeros', 'Pasajeros')
    .addTag('autos', 'Autos')
    .addTag('viajes', 'Viajes')
    .addTag('reservas', 'Reservas')
    .addTag('paquetes', 'Paquetes')
    .addTag('trazabilidad', 'Trazabilidad de paquetes')
    .addTag('ubicacion', 'Ubicación GPS')
    .addTag('pagos', 'Pagos MercadoPago')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Auto-seed: si la DB está vacía (deploy nuevo), poblar datos demo.
  // Idempotente — solo corre cuando no hay destinos; no pisa datos reales.
  // Desactivar con SEED_ON_EMPTY=false.
  if (process.env.SEED_ON_EMPTY !== 'false') {
    const ds = app.get(DataSource);
    const total = await ds.getRepository(Destino).count();
    if (total === 0) {
      console.log('🌱 DB vacía — corriendo seed demo...');
      await app.get(DemoSeed).seed();
    }
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 DES Backend corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
