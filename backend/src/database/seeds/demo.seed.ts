import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { Usuario, UserRole } from '../../modules/users/entities/usuario.entity';
import { Admin } from '../../modules/users/entities/admin.entity';
import { Remiseria, RemiseriaEstado } from '../../modules/remiserias/entities/remiseria.entity';
import { Chofer, ChoferEstado } from '../../modules/choferes/entities/chofer.entity';
import { Pasajero, PasajeroEstado } from '../../modules/pasajeros/entities/pasajero.entity';
import { Auto, AutoEstado } from '../../modules/autos/entities/auto.entity';
import { Viaje, ViajeEstado } from '../../modules/viajes/entities/viaje.entity';
import { Destino } from '../../modules/destinos/entities/destino.entity';
import { Paquete, PaqueteEstado, PaquetePrioridad, PagoPaqueteEstado } from '../../modules/paquetes/entities/paquete.entity';
import { TrazabilidadPaquete } from '../../modules/trazabilidad/entities/trazabilidad-paquete.entity';
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
    @InjectRepository(Paquete)
    private paqueteRepository: Repository<Paquete>,
    @InjectRepository(TrazabilidadPaquete)
    private trazabilidadRepository: Repository<TrazabilidadPaquete>,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seed de datos demo...');

    // Crear remiserías demo
    const remiseria = await this.createRemiseriaDemo();
    const remiseriaPerico = await this.createRemiseriaPerico();

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

    const chofer3 = await this.createUsuarioDemo(
      'Pedro',
      'Fernandez',
      'pedro.chofer@des.com',
      UserRole.CHOFER,
      remiseriaPerico.idRemiseria,
    );

    const chofer4 = await this.createUsuarioDemo(
      'Javier',
      'Diaz',
      'javier.chofer@des.com',
      UserRole.CHOFER,
      remiseriaPerico.idRemiseria,
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
    const idChofer3 = chofer3.chofer?.idChofer;
    const idChofer4 = chofer4.chofer?.idChofer;

    if (!idChofer1 || !idChofer2 || !idChofer3 || !idChofer4) {
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

    const auto3 = await this.createAutoDemo(
      'GHI789',
      'Fiat',
      'Cronos',
      2022,
      idChofer3,
      remiseriaPerico.idRemiseria,
    );

    const auto4 = await this.createAutoDemo(
      'JKL012',
      'Chevrolet',
      'Onix',
      2021,
      idChofer4,
      remiseriaPerico.idRemiseria,
    );

    // Crear catálogo de destinos
    const destinos = await this.createDestinosDemo();
    const perico = destinos.find((d) => d.nombre === 'Perico')!;
    const sanSalvador = destinos.find(
      (d) => d.nombre === 'San Salvador de Jujuy',
    )!;

    // Crear viajes: 2 hoy (para el KPI "Viajes de hoy"), 1 mañana y 1
    // pasado mañana. fmt usa fecha LOCAL — toISOString() daría la fecha UTC
    // y correría el día en Argentina (UTC-3).
    const hoy = new Date();
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const pasado = new Date(manana);
    pasado.setDate(pasado.getDate() + 1);
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    await this.createViajeDemo(
      idChofer1,
      auto1.idAuto,
      perico.idDestino,
      sanSalvador.idDestino,
      fmt(hoy),
      '08:00:00',
      4,
      ViajeEstado.FINALIZADO,
    );

    await this.createViajeDemo(
      idChofer3,
      auto3.idAuto,
      perico.idDestino,
      sanSalvador.idDestino,
      fmt(hoy),
      '14:00:00',
      4,
      ViajeEstado.EN_CURSO,
    );

    await this.createViajeDemo(
      idChofer4,
      auto4.idAuto,
      sanSalvador.idDestino,
      perico.idDestino,
      fmt(hoy),
      '16:30:00',
      4,
    );

    await this.createViajeDemo(
      idChofer2,
      auto2.idAuto,
      sanSalvador.idDestino,
      perico.idDestino,
      fmt(manana),
      '09:30:00',
      4,
    );

    await this.createViajeDemo(
      idChofer1,
      auto1.idAuto,
      perico.idDestino,
      sanSalvador.idDestino,
      fmt(pasado),
      '14:00:00',
      4,
    );

    // Los viajes de días anteriores quedan FINALIZADOS: son historia, no
    // salidas vigentes — el dashboard y la búsqueda reflejan datos reales.
    await this.viajeRepository.update(
      {
        fechaSalida: LessThan(fmt(hoy) as any),
        estadoViaje: In([
          ViajeEstado.ABIERTO,
          ViajeEstado.EN_CURSO,
          ViajeEstado.COMPLETO,
        ]),
      },
      { estadoViaje: ViajeEstado.FINALIZADO },
    );

    // Demo: choferes con última posición conocida en Perico (punto de partida)
    // para que el pasajero vea el móvil en el mapa de Mi Viaje y el admin
    // vea la flota en el dashboard. Offsets chicos para que no se tapen.
    await this.choferRepository.update(
      { idChofer: idChofer1 },
      { latitud: -24.386421, longitud: -65.114175 },
    );
    await this.choferRepository.update(
      { idChofer: idChofer2 },
      { latitud: -24.386421, longitud: -65.114175 },
    );
    await this.choferRepository.update(
      { idChofer: idChofer3 },
      { latitud: -24.3847, longitud: -65.1168 },
    );
    await this.choferRepository.update(
      { idChofer: idChofer4 },
      { latitud: -24.3881, longitud: -65.1115 },
    );

    // Demo paquetería: un envío en tránsito con Carlos y otro asignado a
    // Pedro, con códigos fijos para probar el tracking público.
    const idPasajero1 = pasajero1.pasajero?.idPasajero;
    const idPasajero2 = pasajero2.pasajero?.idPasajero;
    if (!idPasajero1 || !idPasajero2) {
      throw new Error('No se pudieron crear los pasajeros correctamente');
    }
    await this.createPaqueteDemo(
      idPasajero1,
      remiseria.idRemiseria,
      idChofer1,
      PaqueteEstado.EN_TRANSITO,
      'DES-DEMO0001',
      'Caja con libros',
      sanSalvador,
      perico,
      '388-1111111',
      '388-2222222',
    );
    await this.createPaqueteDemo(
      idPasajero2,
      remiseriaPerico.idRemiseria,
      idChofer3,
      PaqueteEstado.ASIGNADO,
      'DES-DEMO0002',
      'Documentos en sobre',
      perico,
      sanSalvador,
      '388-3333333',
      '388-4444444',
    );

    console.log('✅ Seed de datos completado');
    console.log('📊 Datos creados:');
    console.log(`  - 2 remiserías: ${remiseria.nombre}, ${remiseriaPerico.nombre}`);
    console.log(`  - ${admin.nombre} (Admin)`);
    console.log(`  - ${chofer1.nombre} (Chofer)`);
    console.log(`  - ${chofer2.nombre} (Chofer)`);
    console.log(`  - ${chofer3.nombre} (Chofer)`);
    console.log(`  - ${chofer4.nombre} (Chofer)`);
    console.log(`  - ${pasajero1.nombre} (Pasajero)`);
    console.log(`  - ${pasajero2.nombre} (Pasajero)`);
    console.log(`  - 4 autos`);
    console.log(`  - 5 viajes programados`);
    console.log(`  - 2 paquetes demo (DES-DEMO0001, DES-DEMO0002)`);
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
        latitud: -24.191027,
        longitud: -65.302419,
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
        latitud: -24.191027,
        longitud: -65.302419,
        radioKm: 50,
        ciudades: ['San Salvador de Jujuy', 'Perico'],
      },
    });

    return this.remiseriaRepository.save(remiseria);
  }

  private async createRemiseriaPerico(): Promise<Remiseria> {
    const existing = await this.remiseriaRepository.findOne({
      where: { cuit: '30987654321' },
    });

    if (existing) {
      console.log('  ℹ️  Remisería Perico ya existe, actualizando...');
      existing.nombre = 'Remisería Perico';
      existing.telefono = '388-7654321';
      existing.email = 'info@remiseriaperico.com';
      existing.direccion = 'Perico, Jujuy, Argentina';
      existing.estado = RemiseriaEstado.ACTIVA;
      existing.configuracion = {
        tarifaBase: 500,
        tarifaPorKm: 50,
        maxAutosPorChofer: 3,
        maxAsientosPorAuto: 4,
        tiempoCancelacionMinutos: 30,
      };
      existing.zonaOperacion = {
        latitud: -24.386421,
        longitud: -65.114175,
        radioKm: 40,
        ciudades: ['Perico', 'San Salvador de Jujuy', 'El Carmen'],
      };
      return this.remiseriaRepository.save(existing);
    }

    const remiseria = this.remiseriaRepository.create({
      nombre: 'Remisería Perico',
      cuit: '30987654321',
      telefono: '388-7654321',
      email: 'info@remiseriaperico.com',
      direccion: 'Perico, Jujuy, Argentina',
      estado: RemiseriaEstado.ACTIVA,
      configuracion: {
        tarifaBase: 500,
        tarifaPorKm: 50,
        maxAutosPorChofer: 3,
        maxAsientosPorAuto: 4,
        tiempoCancelacionMinutos: 30,
      },
      zonaOperacion: {
        latitud: -24.386421,
        longitud: -65.114175,
        radioKm: 40,
        ciudades: ['Perico', 'San Salvador de Jujuy', 'El Carmen'],
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
    // Coordenadas: terminal de ómnibus / parada de remises de cada localidad
    // (puntos de referencia para la demo).
    const localidades = [
      // Terminal de Ómnibus de San Salvador (salida habitual a Perico)
      { nombre: 'San Salvador de Jujuy', latitud: -24.191027, longitud: -65.302419 },
      // Parada de remises de Perico (centro)
      { nombre: 'Perico', latitud: -24.386421, longitud: -65.114175 },
      // Palpalá centro
      { nombre: 'Palpalá', latitud: -24.2566, longitud: -65.2119 },
      // Terminal de Humahuaca
      { nombre: 'Humahuaca', latitud: -23.2054, longitud: -65.3495 },
      // Terminal de La Quiaca
      { nombre: 'La Quiaca', latitud: -22.1042, longitud: -65.5701 },
      // Terminal de San Pedro de Jujuy
      { nombre: 'San Pedro de Jujuy', latitud: -24.2313, longitud: -64.8661 },
      // El Carmen centro/parada
      { nombre: 'El Carmen', latitud: -24.3891, longitud: -65.2622 },
      // Monterrico centro/parada
      { nombre: 'Monterrico', latitud: -24.4440, longitud: -65.1707 },
      // Calilegua centro
      { nombre: 'Calilegua', latitud: -23.7790, longitud: -64.8490 },
      // Terminal de Libertador Gral. San Martín (Ledesma)
      { nombre: 'Libertador Gral. San Martín', latitud: -23.8119, longitud: -64.7845 },
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
    estado: ViajeEstado = ViajeEstado.ABIERTO,
  ): Promise<Viaje> {
    // Verificar si ya existe un viaje con estos datos
    const existing = await this.viajeRepository.findOne({
      where: {
        idOrigen,
        idDestino,
        fechaSalida: fecha as any,
        horaSalida: hora,
        idChofer,
      },
    });

    if (existing) {
      console.log(`  ℹ️  Viaje ${idOrigen} → ${idDestino} ya existe, actualizando...`);
      existing.idAuto = idAuto;
      existing.tarifaPorAsiento = 800;
      existing.asientosDisponibles = asientos;
      existing.estadoViaje = estado;
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
      fechaSalida: fecha as any,
      horaSalida: hora,
      tarifaPorAsiento: 800,
      asientosDisponibles: asientos,
      estadoViaje: estado,
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

  /**
   * Paquete demo idempotente por código de seguimiento. Genera además los
   * eventos de trazabilidad coherentes con el estado actual para que el
   * tracking público muestre timeline y mapa.
   */
  private async createPaqueteDemo(
    idRemitente: number,
    idRemiseria: number,
    idChofer: number,
    estado: PaqueteEstado,
    codigo: string,
    descripcion: string,
    origen: Destino,
    destino: Destino,
    telOrigen: string,
    telDestino: string,
  ): Promise<Paquete> {
    const existing = await this.paqueteRepository.findOne({
      where: { codigoSeguimiento: codigo },
    });

    if (existing) {
      console.log(`  ℹ️  Paquete ${codigo} ya existe, actualizando...`);
      existing.idChofer = idChofer;
      existing.estado = estado;
      return this.paqueteRepository.save(existing);
    }

    const paquete = this.paqueteRepository.create({
      idRemiseria,
      idChofer,
      idPasajeroRemitente: idRemitente,
      descripcion,
      peso: 0.8,
      dimensiones: '20x30x15',
      estado,
      prioridad: PaquetePrioridad.NORMAL,
      tarifa: 2000,
      valorDeclarado: 5000,
      estadoPago: PagoPaqueteEstado.PAGADO,
      codigoSeguimiento: codigo,
      origen: {
        direccion: `${origen.nombre} (parada)`,
        latitud: origen.latitud,
        longitud: origen.longitud,
        telefono: telOrigen,
      },
      destino: {
        direccion: `${destino.nombre} (parada)`,
        latitud: destino.latitud,
        longitud: destino.longitud,
        telefono: telDestino,
      },
    });
    const saved = await this.paqueteRepository.save(paquete);

    // Eventos de trazabilidad según el estado alcanzado (con GPS en Perico
    // y sobre la RN66 para que el mapa público tenga puntos reales).
    const eventos: Array<{
      anterior: PaqueteEstado;
      nuevo: PaqueteEstado;
      obs: string;
      lat?: number;
      lng?: number;
    }> = [
      {
        anterior: PaqueteEstado.PENDIENTE_RECOGIDA,
        nuevo: PaqueteEstado.RECIBIDO,
        obs: 'Recibido en parada',
        lat: Number(origen.latitud),
        lng: Number(origen.longitud),
      },
      {
        anterior: PaqueteEstado.RECIBIDO,
        nuevo: PaqueteEstado.ASIGNADO,
        obs: 'Asignado a móvil',
      },
      {
        anterior: PaqueteEstado.ASIGNADO,
        nuevo: PaqueteEstado.EN_TRANSITO,
        obs: 'Paquete retirado — código verificado',
        lat: -24.33,
        lng: -65.18,
      },
    ];
    const ORDEN = [
      PaqueteEstado.PENDIENTE_RECOGIDA,
      PaqueteEstado.RECIBIDO,
      PaqueteEstado.ASIGNADO,
      PaqueteEstado.EN_TRANSITO,
      PaqueteEstado.ENTREGADO,
    ];
    const hasta = ORDEN.indexOf(estado);
    for (const ev of eventos) {
      if (ORDEN.indexOf(ev.nuevo) <= hasta) {
        await this.trazabilidadRepository.save(
          this.trazabilidadRepository.create({
            idPaquete: saved.idPaquete,
            estadoAnterior: ev.anterior,
            estadoNuevo: ev.nuevo,
            observaciones: ev.obs,
            latitud: ev.lat,
            longitud: ev.lng,
            usuarioResponsable: 'seed-demo',
          }),
        );
      }
    }

    return saved;
  }
}
