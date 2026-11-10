import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destino } from './entities/destino.entity';
import { CreateDestinoDto, UpdateDestinoDto } from './dto/destino.dto';

@Injectable()
export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private destinoRepository: Repository<Destino>,
  ) {}

  findAll(incluirInactivos = false): Promise<Destino[]> {
    return this.destinoRepository.find({
      where: incluirInactivos ? {} : { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Destino> {
    const destino = await this.destinoRepository.findOne({
      where: { idDestino: id },
    });
    if (!destino) {
      throw new NotFoundException(`Destino con ID ${id} no encontrado`);
    }
    return destino;
  }

  async create(dto: CreateDestinoDto): Promise<Destino> {
    const existe = await this.destinoRepository.findOne({
      where: { nombre: dto.nombre },
    });
    if (existe) {
      throw new ConflictException(`Ya existe un destino llamado "${dto.nombre}"`);
    }
    return this.destinoRepository.save(this.destinoRepository.create(dto));
  }

  async update(id: number, dto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.findOne(id);
    if (dto.nombre && dto.nombre !== destino.nombre) {
      const existe = await this.destinoRepository.findOne({
        where: { nombre: dto.nombre },
      });
      if (existe) {
        throw new ConflictException(`Ya existe un destino llamado "${dto.nombre}"`);
      }
    }
    Object.assign(destino, dto);
    return this.destinoRepository.save(destino);
  }

  async remove(id: number): Promise<{ message: string }> {
    const destino = await this.findOne(id);
    destino.activo = false;
    await this.destinoRepository.save(destino);
    return { message: `Destino "${destino.nombre}" desactivado` };
  }
}
