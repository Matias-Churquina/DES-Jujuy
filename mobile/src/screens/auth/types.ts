export interface User {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'PASAJERO' | 'CHOFER' | 'ADMIN';
  telefono?: string;
  chofer?: {
    idChofer: number;
    estadoChofer: string;
  };
  pasajero?: {
    idPasajero: number;
    estadoPasajero: string;
  };
}

export interface AuthResponse {
  status: number;
  msg: string;
  token: string;
  usuario: User;
  rol: string;
  idChofer?: number;
  idPasajero?: number;
}
