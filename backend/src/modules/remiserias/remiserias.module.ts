import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemiseriasController } from './remiserias.controller';
import { RemiseriasService } from './remiserias.service';
import { Remiseria } from './entities/remiseria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Remiseria])],
  controllers: [RemiseriasController],
  providers: [RemiseriasService],
  exports: [RemiseriasService],
})
export class RemiseriasModule {}
