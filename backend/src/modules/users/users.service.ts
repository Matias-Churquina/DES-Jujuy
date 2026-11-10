import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      relations: ['chofer', 'pasajero', 'admin'],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
      relations: ['chofer', 'pasajero', 'admin'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario> {
    return this.usuarioRepository.findOne({
      where: { email },
      relations: ['chofer', 'pasajero', 'admin'],
    });
  }
}
