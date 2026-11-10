import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Remiseria } from './entities/remiseria.entity';

@Injectable()
export class RemiseriasService {
  constructor(
    @InjectRepository(Remiseria)
    private remiseriaRepository: Repository<Remiseria>,
  ) {}

  async findAll(): Promise<Remiseria[]> {
    return this.remiseriaRepository.find({
      relations: ['choferes', 'autos'],
    });
  }

  async findOne(id: number): Promise<Remiseria> {
    const remiseria = await this.remiseriaRepository.findOne({
      where: { idRemiseria: id },
      relations: ['choferes', 'autos'],
    });

    if (!remiseria) {
      throw new NotFoundException(`Remisería con ID ${id} no encontrada`);
    }

    return remiseria;
  }

  async create(remiseriaData: Partial<Remiseria>): Promise<Remiseria> {
    const remiseria = this.remiseriaRepository.create(remiseriaData);
    return this.remiseriaRepository.save(remiseria);
  }

  async update(id: number, remiseriaData: Partial<Remiseria>): Promise<Remiseria> {
    await this.remiseriaRepository.update(id, remiseriaData);
    return this.findOne(id);
  }
}
