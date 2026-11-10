export type Rol = 'PASAJERO' | 'CHOFER' | 'ADMIN';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  activo: boolean;
  rol: Rol;
  chofer?: Chofer;
  pasajero?: Pasajero;
  admin?: Admin;
}

export interface Chofer {
  idChofer: number;
  idUsuario: number;
  idRemiseria: number;
  licenciaConducir: string;
  estadoChofer: 'DISPONIBLE' | 'EN_VIAJE' | 'DESCANSO' | 'SUSPENDIDO' | 'INACTIVO';
  calificacion: number;
  latitud?: number;
  longitud?: number;
  usuario?: Usuario;
  autos?: Auto[];
}

export interface Pasajero {
  idPasajero: number;
  idUsuario: number;
  estadoPasajero: 'ACTIVO' | 'SUSPENDIDO' | 'BLOQUEADO';
  calificacion: number;
  cantidadReservas: number;
  usuario?: Usuario;
}

export interface Admin {
  idAdmin: number;
  idUsuario: number;
  idRemiseria?: number;
  estadoAdmin: string;
}

export interface Auto {
  idAuto: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  capacidadAsientos: number;
  estado: string;
  color?: string;
}

export interface Destino {
  idDestino: number;
  nombre: string;
  latitud?: number;
  longitud?: number;
  activo: boolean;
}

export interface Viaje {
  idViaje: number;
  idChofer: number;
  idAuto: number;
  idOrigen: number;
  idDestino: number;
  origen?: Destino;
  destino?: Destino;
  fechaSalida: string;
  horaSalida: string;
  tarifaPorAsiento: number;
  asientosDisponibles: number;
  estadoViaje: 'ABIERTO' | 'COMPLETO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
  chofer?: Chofer;
  auto?: Auto;
  reservas?: Reserva[];
}

export interface Reserva {
  idReserva: number;
  idPasajero: number;
  idViaje: number;
  cantidadAsientos: number;
  importeTotal: number;
  estadoReserva: string;
  estadoPago: string;
  canalPago?: string;
  viaje?: Viaje;
  pasajero?: Pasajero;
  createdAt?: string;
}

export interface Remiseria {
  idRemiseria: number;
  nombre: string;
  cuit: string;
  telefono: string;
  email: string;
  direccion?: string;
  estado: string;
}

export interface Trazabilidad {
  estado: string;
  fecha: string;
  observaciones?: string;
  latitud?: number;
  longitud?: number;
}

export interface Paquete {
  idPaquete: number;
  codigoSeguimiento: string;
  estado: 'PENDIENTE_RECOGIDA' | 'RECIBIDO' | 'ASIGNADO' | 'EN_TRANSITO' | 'ENTREGADO' | 'INCIDENCIA' | 'DEVUELTO' | 'CANCELADO';
  prioridad: 'NORMAL' | 'URGENTE' | 'FRAGIL';
  descripcion: string;
  tarifa: number;
  origen?: { latitud?: number; longitud?: number; direccion: string; contacto: string; telefono: string };
  destino?: { latitud?: number; longitud?: number; direccion: string; contacto: string; telefono: string };
  idChofer?: number;
  chofer?: Chofer;
  pasajeroRemitente?: Pasajero;
  trazabilidad?: Trazabilidad[];
  createdAt: string;
}

export interface TrackingPaquete {
  codigoSeguimiento: string;
  estado: string;
  prioridad: string;
  descripcion: string;
  origenDireccion?: string;
  destinoDireccion?: string;
  remiseria?: string;
  createdAt: string;
  ubicacionActual?: { latitud: number; longitud: number; fechaHora: string } | null;
  timeline: Trazabilidad[];
}

export interface LoginResponse {
  status: number;
  msg: string;
  token: string;
  usuario: Usuario;
  rol: Rol;
}
