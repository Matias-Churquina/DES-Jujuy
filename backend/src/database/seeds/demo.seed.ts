import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, UserRole } from '../../modules/users/entities/usuario.entity';
import { Admin } from '../../modules/users/entities/admin.entity';
import { Remiseria, RemiseriaEstado } from '../../modules/remiserias/entities/remiseria.entity';
import { Chofer, ChoferEstado } from '../../modules/choferes/entities/chofer.entity';
import { Pasajero, PasajeroEstado } from '../../modules/pasajeros/entities/pasajero.entity';
import { Auto, AutoEstado } from '../../modules/autos/entities/auto.entity';
import { Viaje, ViajeEstado } from '../../modules/viajes/entities/viaje.entity';
import { Destino } from '../../modules/destinos/entities/destino.entity';
// bcrypt is no longer needed here as passwords are hashed by entity hooks

@Injectable()
export class DemoSeed {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Remiseria)
    private remiseriaRepository: Repository<Remiseria>,
    @InjectRepository(Chofer)
    private choferRepository: Repository<Chofer>,
    @InjectRepository(Pasajero)
    private pasajeroRepository: Repository<Pasajero>,
    @InjectRepository(Auto)
    private autoRepository: Repository<Auto>,
    @InjectRepository(Viaje)
    private viajeRepository: Repository<Viaje>,
    @InjectRepository(Destino)
    private destinoRepository: Repository<Destino>,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seed de datos demo...');

    // Crear remisería demo
    const remiseria = await this.createRemiseriaDemo();

    // Crear usuarios demo
    const admin = await this.createUsuarioDemo(
      'Admin',
      'Demo',
      'admin@des.com',
      UserRole.ADMIN,
      remiseria.idRemiseria,
    );

    const chofer1 = await this.createUsuarioDemo(
      'Carlos',
      'Rodriguez',
      'carlos.chofer@des.com',
      UserRole.CHOFER,
      remiseria.idRemiseria,
    );

    const chofer2 = await this.createUsuarioDemo(
      'Miguel',
      'Lopez',
      'miguel.chofer@des.com',
      UserRole.CHOFER,
      remiseria.idRemiseria,
    );

    const pasajero1 = await this.createUsuarioDemo(
      'Ana',
      'Garcia',
      'ana.pasajero@des.com',
      UserRole.PASAJERO,
    );

    const pasajero2 = await this.createUsuarioDemo(
      'Luis',
      'Martinez',
      'luis.pasajero@des.com',
      UserRole.PASAJERO,
    );

    // Obtener IDs de los choferes
    const idChofer1 = chofer1.chofer?.idChofer;
    const idChofer2 = chofer2.chofer?.idChofer;

    if (!idChofer1 || !idChofer2) {
      throw new Error('No se pudieron crear los choferes correctamente');
    }

    // Crear autos
    const auto1 = await this.createAutoDemo(
      'ABC123',
      'Toyota',
      'Corolla',
      2020,
      idChofer1,
      remiseria.idRemiseria,
    );

    const auto2 = await this.createAutoDemo(
      'DEF456',
      'Ford',
      'Focus',
      2019,
      idChofer2,
      remiseria.idRemiseria,
    );

    // Crear catálogo de destinos
    const destinos = await this.createDestinosDemo();
    const perico = destinos.find((d) => d.nombre === 'Perico')!;
    const sanSalvador = destinos.find(
      (d) => d.nombre === 'San Salvador de Jujuy',
    )!;

    // Crear viajes (fechas futuras para que sean reservables)
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const pasado = new Date(manana);
    pasado.setDate(pasado.getDate() + 1);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    await this.createViajeDemo(
      idChofer1,
      auto1.idAuto,
      perico.idDestino,
      sanSalvador.idDestino,
      fmt(manana),
      '08:00:00',
      4,
    );

    await this.createViajeDemo(
      idChofer2,
      auto2.idAuto,
      sanSalvador.idDestino,
      perico.idDestino,
      fmt(pasado),
      '14:00:00',
      4,
    );

    // Demo: choferes con última posición conocida en Perico (punto de partida)
    // para que el pasajero vea el móvil en el mapa de Mi Viaje.
    await this.choferRepository.update(
      { idChofer: idChofer1 },
      { latitud: -24.386421, longitud: -65.114175 },
    );
    await this.choferRepository.update(
      { idChofer: idChofer2 },
      { latitud: -24.386421, longitud: -65.114175 },
    );

    console.log('✅ Seed de datos completado');
    console.log('📊 Datos creados:');
    console.log(`  - 1 remisería: ${remiseria.nombre}`);
    console.log(`  - ${admin.nombre} (Admin)`);
    console.log(`  - ${chofer1.nombre} (Chofer)`);
    console.log(`  - ${chofer2.nombre} (Chofer)`);
    console.log(`  - ${pasajero1.nombre} (Pasajero)`);
    console.log(`  - ${pasajero2.nombre} (Pasajero)`);
    console.log(`  - 2 autos`);
    console.log(`  - 2 viajes programados`);
  }

  private async createRemiseriaDemo(): Promise<Remiseria> {
    // Verificar si ya existe una remisería con este CUIT
    const existing = await this.remiseriaRepository.findOne({
      where: { cuit: '30123456789' },
    });

    if (existing) {
      console.log('  ℹ️  Remisería ya existe, actualizando...');
      existing.nombre = 'Remises Demo Jujuy';
      existing.telefono = '388-1234567';
      existing.email = 'info@remisesdemo.com';
      existing.direccion = 'San Salvador de Jujuy, Argentina';
      existing.estado = RemiseriaEstado.ACTIVA;
      existing.configuracion = {
        tarifaBase: 500,
        tarifaPorKm: 50,
        maxAutosPorChofer: 3,
        maxAsientosPorAuto: 4,
        tiempoCancelacionMinutos: 30,
      };
      existing.zonaOperacion = {
        latitud: -24.1858,
        longitud: -65.2995,
        radioKm: 50,
        ciudades: ['San Salvador de Jujuy', 'Perico'],
      };
      return this.remiseriaRepository.save(existing);
    }

    const remiseria = this.remiseriaRepository.create({
      nombre: 'Remises Demo Jujuy',
      cuit: '30123456789',
      telefono: '388-1234567',
      email: 'info@remisesdemo.com',
      direccion: 'San Salvador de Jujuy, Argentina',
      estado: RemiseriaEstado.ACTIVA,
      configuracion: {
        tarifaBase: 500,
        tarifaPorKm: 50,
        maxAutosPorChofer: 3,
        maxAsientosPorAuto: 4,
        tiempoCancelacionMinutos: 30,
      },
      zonaOperacion: {
        latitud: -24.1858,
        longitud: -65.2995,
        radioKm: 50,
        ciudades: ['San Salvador de Jujuy', 'Perico'],
      },
    });

    return this.remiseriaRepository.save(remiseria);
  }

  private async createUsuarioDemo(
    nombre: string,
    apellido: string,
    email: string,
    rol: UserRole,
    idRemiseria?: number,
  ): Promise<Usuario> {
    // Verificar si el usuario ya existe por email
    const existingUsuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['chofer', 'pasajero', 'admin'],
    });

    if (existingUsuario) {
      console.log(`  ℹ️  Usuario ${email} ya existe, actualizando...`);
      existingUsuario.nombre = nombre;
      existingUsuario.apellido = apellido;
      existingUsuario.passwordHash = 'demo123'; // Resetear password (se hashea en @BeforeUpdate)
      existingUsuario.telefono = `388-${Math.floor(Math.random() * 9000000 + 1000000)}`;
      existingUsuario.activo = true;
      existingUsuario.rol = rol;

      await this.usuarioRepository.save(existingUsuario);

      // Crear perfil si no existe
      if (rol === UserRole.CHOFER && !existingUsuario.chofer) {
        const chofer = this.choferRepository.create({
          idUsuario: existingUsuario.idUsuario,
          idRemiseria,
          licenciaConducir: `LIC-${Math.floor(Math.random() * 1000000)}`,
          estadoChofer: ChoferEstado.DISPONIBLE,
          fechaHabilitacion: new Date(),
          calificacion: 4.5,
        });
        await this.choferRepository.save(chofer);
      } else if (rol === UserRole.PASAJERO && !existingUsuario.pasajero) {
        const pasajero = this.pasajeroRepository.create({
          idUsuario: existingUsuario.idUsuario,
          estadoPasajero: PasajeroEstado.ACTIVO,
          calificacion: 0,
          cantidadReservas: 0,
        });
        await this.pasajeroRepository.save(pasajero);
      } else if (rol === UserRole.ADMIN && !existingUsuario.admin) {
        const admin = this.adminRepository.create({
          idUsuario: existingUsuario.idUsuario,
          idRemiseria,
          estadoAdmin: 'ACTIVO' as any,
        });
        await this.adminRepository.save(admin);
      }

      return await this.usuarioRepository.findOne({
        where: { idUsuario: existingUsuario.idUsuario },
        relations: ['chofer', 'pasajero', 'admin'],
      }) as Usuario;
    }

    const usuario = this.usuarioRepository.create({
      nombre,
      apellido,
      email,
      passwordHash: 'demo123', // Será hasheado por @BeforeInsert
      telefono: `388-${Math.floor(Math.random() * 9000000 + 1000000)}`,
      activo: true,
      rol,
    });

    await this.usuarioRepository.save(usuario);

    // Crear perfil según rol
    if (rol === UserRole.CHOFER) {
      const chofer = this.choferRepository.create({
        idUsuario: usuario.idUsuario,
        idRemiseria,
        licenciaConducir: `LIC-${Math.floor(Math.random() * 1000000)}`,
        estadoChofer: ChoferEstado.DISPONIBLE,
        fechaHabilitacion: new Date(),
        calificacion: 4.5,
      });
      await this.choferRepository.save(chofer);
    } else if (rol === UserRole.PASAJERO) {
      const pasajero = this.pasajeroRepository.create({
        idUsuario: usuario.idUsuario,
        estadoPasajero: PasajeroEstado.ACTIVO,
        calificacion: 0,
        cantidadReservas: 0,
      });
      await this.pasajeroRepository.save(pasajero);
    }

    // Recargar usuario con todas las relaciones
    return await this.usuarioRepository.findOne({
      where: { idUsuario: usuario.idUsuario },
      relations: ['chofer', 'pasajero', 'admin'],
    }) as Usuario;
  }

  private async createAutoDemo(
    patente: string,
    marca: string,
    modelo: string,
    anio: number,
    idChofer: number,
    idRemiseria: number,
  ): Promise<Auto> {
    // Verificar si el auto ya existe por patente
    const existing = await this.autoRepository.findOne({
      where: { patente },
    });

    if (existing) {
      console.log(`  ℹ️  Auto ${patente} ya existe, actualizando...`);
      existing.idChofer = idChofer;
      existing.idRemiseria = idRemiseria;
      existing.marca = marca;
      existing.modelo = modelo;
      existing.anio = anio;
      existing.capacidadAsientos = 4;
      existing.estado = AutoEstado.DISPONIBLE;
      existing.color = 'Blanco';
      return this.autoRepository.save(existing);
    }

    const auto = this.autoRepository.create({
      idChofer,
      idRemiseria,
      patente,
      marca,
      modelo,
      anio,
      capacidadAsientos: 4,
      estado: AutoEstado.DISPONIBLE,
      color: 'Blanco',
    });

    return this.autoRepository.save(auto);
  }

  private async createDestinosDemo(): Promise<Destino[]> {
    const localidades = [
      { nombre: 'San Salvador de Jujuy', latitud: -24.191027, longitud: -65.302419 },
      { nombre: 'Perico', latitud: -24.386421, longitud: -65.114175 },
      { nombre: 'Palpalá', latitud: -24.2566, longitud: -65.2119 },
      { nombre: 'Humahuaca', latitud: -23.2054, longitud: -65.3495 },
      { nombre: 'La Quiaca', latitud: -22.1042, longitud: -65.5701 },
      { nombre: 'San Pedro de Jujuy', latitud: -24.2313, longitud: -64.8661 },
      { nombre: 'El Carmen', latitud: -24.3891, longitud: -65.2622 },
      { nombre: 'Calilegua', latitud: -23.7790, longitud: -64.8490 },
    ];

    const destinos: Destino[] = [];
    for (const loc of localidades) {
      let destino = await this.destinoRepository.findOne({
        where: { nombre: loc.nombre },
      });
      if (destino) {
        console.log(`  ℹ️  Destino ${loc.nombre} ya existe, actualizando...`);
        destino.latitud = loc.latitud;
        destino.longitud = loc.longitud;
        destino.activo = true;
      } else {
        destino = this.destinoRepository.create({ ...loc, activo: true });
      }
      destinos.push(await this.destinoRepository.save(destino));
    }
    return destinos;
  }

  private async createViajeDemo(
    idChofer: number,
    idAuto: number,
    idOrigen: number,
    idDestino: number,
    fecha: string,
    hora: string,
    asientos: number,
  ): Promise<Viaje> {
    // Verificar si ya existe un viaje con estos datos
    const existing = await this.viajeRepository.findOne({
      where: {
        idOrigen,
        idDestino,
        fechaSalida: new Date(fecha),
        horaSalida: hora,
        idChofer,
      },
    });

    if (existing) {
      console.log(`  ℹ️  Viaje ${idOrigen} → ${idDestino} ya existe, actualizando...`);
      existing.idAuto = idAuto;
      existing.tarifaPorAsiento = 800;
      existing.asientosDisponibles = asientos;
      existing.estadoViaje = ViajeEstado.ABIERTO;
      existing.ruta = {
        distanciaKm: 33,
        duracionMinutos: 30,
        puntos: [
          { latitud: -24.191027, longitud: -65.302419 },
          { latitud: -24.2350, longitud: -65.2750 },
          { latitud: -24.2800, longitud: -65.2300 },
          { latitud: -24.3300, longitud: -65.1800 },
          { latitud: -24.386421, longitud: -65.114175 },
        ],
      };
      return this.viajeRepository.save(existing);
    }

    const viaje = this.viajeRepository.create({
      idChofer,
      idAuto,
      idOrigen,
      idDestino,
      fechaSalida: new Date(fecha),
      horaSalida: hora,
      tarifaPorAsiento: 800,
      asientosDisponibles: asientos,
      estadoViaje: ViajeEstado.ABIERTO,
      ruta: {
        distanciaKm: 33,
        duracionMinutos: 30,
        puntos: [
          { latitud: -24.191027, longitud: -65.302419 },
          { latitud: -24.2350, longitud: -65.2750 },
          { latitud: -24.2800, longitud: -65.2300 },
          { latitud: -24.3300, longitud: -65.1800 },
          { latitud: -24.386421, longitud: -65.114175 },
        ],
      },
    });

    return this.viajeRepository.save(viaje);
  }
}
