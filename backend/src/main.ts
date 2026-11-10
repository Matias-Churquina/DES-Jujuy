import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

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

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 DES Backend corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
