import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { getSocket } from '@/lib/socket';
import { obtenerRuta, type RutaInfo } from '@/lib/osrm';
import Mapa, { type Marcador } from '@/components/Mapa';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/Toast';
import Icon from '@/components/Icon';
import type { Reserva } from '@/types';

interface Posicion { lat: number; lng: number; }

interface Mensaje {
  idMensaje: number; idReserva: number; idEmisor: number;
  idReceptor: number; texto: string; leido: boolean; createdAt: string;
}

export default function MiViaje() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [choferPos, setChoferPos] = useState<Posicion | null>(null);
  const [ruta, setRuta] = useState<RutaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [cancelando, setCancelando] = useState(false);

  const idPasajero = user?.pasajero?.idPasajero;
  const idUsuario = user?.idUsuario;

  useEffect(() => {
    if (!idPasajero) { setLoading(false); return; }
    api.get<Reserva[]>(`/reservas/pasajero/${idPasajero}`)
      .then((r) => {
        const activa = r.data.find(
          (x) =>
            x.estadoReserva === 'CONFIRMADA' &&
            x.viaje &&
            ['ABIERTO', 'COMPLETO', 'EN_CURSO'].includes(x.viaje.estadoViaje),
        );
        setReserva(activa ?? null);
        const c = activa?.viaje?.chofer;
        if (c?.latitud != null && c?.longitud != null) {
          setChoferPos({ lat: c.latitud, lng: c.longitud });
        }
      })
      .finally(() => setLoading(false));
  }, [idPasajero]);

  // Chat: historial + sala reserva_X
  useEffect(() => {
    if (!reserva?.idReserva || !idUsuario) return;
    api.get<Mensaje[]>(`/chat/reserva/${reserva.idReserva}`)
      .then((r) => setMensajes(r.data)).catch(() => {});
    api.patch(`/chat/reserva/${reserva.idReserva}/leer`).catch(() => {});
    const socket = getSocket();
    const onMsg = (m: Mensaje) => {
      if (m.idReserva !== reserva.idReserva) return;
      setMensajes((prev) => prev.some((x) => x.idMensaje === m.idMensaje) ? prev : [...prev, m]);
      if (m.idReceptor === idUsuario) api.patch(`/chat/reserva/${reserva.idReserva}/leer`).catch(() => {});
    };
    socket.emit('join', { userId: idUsuario, type: 'reserva', id: reserva.idReserva });
    socket.on('mensaje_nuevo', onMsg);
    return () => {
      socket.emit('leave', { type: 'reserva', id: reserva.idReserva });
      socket.off('mensaje_nuevo', onMsg);
    };
  }, [reserva?.idReserva, idUsuario]);

  // WebSocket: ubicación en vivo del chofer
  useEffect(() => {
    if (!reserva?.idViaje || !user) return;
    const socket = getSocket();
    socket.emit('join', { userId: user.idUsuario, type: 'viaje', id: String(reserva.idViaje) });
    const handler = (data: { idViaje: number; latitud: number; longitud: number }) => {
      if (data.idViaje === reserva.idViaje) setChoferPos({ lat: data.latitud, lng: data.longitud });
    };
    socket.on('ubicacion_chofer', handler);
    return () => {
      socket.off('ubicacion_chofer', handler);
      socket.emit('leave', { type: 'viaje', id: String(reserva.idViaje) });
    };
  }, [reserva?.idViaje, user]);

  // Ruta + ETA
  useEffect(() => {
    const v = reserva?.viaje;
    const origen = v?.origen;
    const destino = v?.destino;
    if (origen?.latitud == null || destino?.latitud == null) return;
    const desde =
      choferPos && v?.estadoViaje === 'EN_CURSO'
        ? choferPos
        : { lat: origen.latitud, lng: origen.longitud! };
    obtenerRuta(
      desde,
      { lat: destino.latitud, lng: destino.longitud! },
    ).then(setRuta);
  }, [reserva?.idViaje, choferPos?.lat, choferPos?.lng]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = texto.trim();
    if (!t || !reserva) return;
    try {
      const { data } = await api.post<Mensaje>(`/chat/reserva/${reserva.idReserva}`, { texto: t });
      setMensajes((prev) => prev.some((x) => x.idMensaje === data.idMensaje) ? prev : [...prev, data]);
      setTexto('');
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo enviar');
    }
  };

  const cancelar = async () => {
    if (!reserva) return;
    setCancelando(true);
    try {
      await api.patch(`/reservas/${reserva.idReserva}/cancelar`);
      toast('info', 'Reserva cancelada — los asientos fueron liberados');
      setReserva(null);
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo cancelar');
    } finally {
      setCancelando(false);
    }
  };

  if (loading) return <Spinner />;
  if (!reserva?.viaje) {
    return <EmptyState message="No tenés un viaje activo. Reservá uno desde Inicio." />;
  }

  const v = reserva.viaje;
  const chofer = v.chofer;
  const enCurso = v.estadoViaje === 'EN_CURSO';
  const marcadores: Marcador[] = [
    ...(v.origen?.latitud != null ? [{ lat: v.origen.latitud, lng: v.origen.longitud!, emoji: '🏠' }] : []),
    ...(v.destino?.latitud != null ? [{ lat: v.destino.latitud, lng: v.destino.longitud!, emoji: '📍' }] : []),
    ...(choferPos ? [{ ...choferPos, emoji: '🚗' }] : []),
  ];

  return (
    <div className="active-trip-layout">
      <div className="trip-map-wrap">
        <div className="eta-card">
          <span>{enCurso ? 'LLEGADA ESTIMADA' : 'SALIDA PROGRAMADA'}</span>
          <strong>{enCurso && ruta ? `${ruta.duracionMin} min` : v.horaSalida?.slice(0, 5)}</strong>
          <small>{ruta ? `${ruta.distanciaKm} km de recorrido` : `${v.origen?.nombre} → ${v.destino?.nombre}`}</small>
        </div>
        <Mapa marcadores={marcadores} ruta={ruta?.puntos} />
      </div>

      <aside className="trip-sheet card">
        <div className="sheet-handle" />
        <div className="trip-status">
          <div>
            <span className={`badge ${enCurso ? 'success' : 'violet'}`}>
              <span className="badge-dot" />{v.estadoViaje.replace(/_/g, ' ')}
            </span>
            <h2>{v.origen?.nombre} → {v.destino?.nombre}</h2>
          </div>
          {enCurso && <div className="live"><i />EN VIVO</div>}
        </div>

        <div className="driver-profile">
          <div className="avatar" style={{ width: 51, height: 51, borderRadius: 13, fontSize: 15 }}>
            {chofer?.usuario?.nombre?.[0]}{chofer?.usuario?.apellido?.[0]}
          </div>
          <div>
            <strong>{chofer?.usuario?.nombre} {chofer?.usuario?.apellido} <span className="verified"><Icon name="send" size={8} /></span></strong>
            <span><b>★ {chofer?.calificacion}</b> · Chofer verificado</span>
            <small>{v.auto?.marca} {v.auto?.modelo}</small>
          </div>
          <span className="plate">{v.auto?.patente}</span>
        </div>

        <div className="trip-route-summary">
          <div className="timeline-dots">
            <i /><span /><i />
          </div>
          <div>
            <span>ORIGEN</span>
            <strong>{v.origen?.nombre}</strong>
            <span>DESTINO</span>
            <strong>{v.destino?.nombre}</strong>
          </div>
        </div>

        <div className="trip-meta">
          <div><Icon name="calendar" /><div><span>FECHA</span><strong>{new Date(v.fechaSalida + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</strong></div></div>
          <div><Icon name="clock" /><div><span>HORA</span><strong>{v.horaSalida?.slice(0, 5)}</strong></div></div>
          <div><Icon name="seat" /><div><span>ASIENTOS</span><strong>{reserva.cantidadAsientos}</strong></div></div>
          <div><Icon name="wallet" /><div><span>PAGO</span><strong>${Number(reserva.importeTotal).toLocaleString('es-AR')} · {reserva.estadoPago}</strong></div></div>
        </div>

        <div className="trip-actions">
          <button onClick={cancelar} disabled={cancelando} style={{ color: 'var(--danger)' }}>
            {cancelando ? 'Cancelando…' : 'Cancelar reserva'}
          </button>
          <a href={`tel:${chofer?.usuario?.telefono || ''}`} style={{ display: 'contents' }}>
            <button><Icon name="phone" size={14} />Llamar</button>
          </a>
        </div>

        <div className="chat">
          <div className="chat-head">
            <strong>Chat con {chofer?.usuario?.nombre || 'tu chofer'}</strong>
            <span>en línea</span>
          </div>
          {mensajes.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 10, marginTop: 12 }}>
              Todavía no hay mensajes. Coordiná la recogida por acá.
            </p>
          )}
          {mensajes.map((m) => (
            <div key={m.idMensaje} className={`message ${m.idEmisor === idUsuario ? 'sent' : ''}`}>
              {m.texto}
              <small>{new Date(m.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</small>
            </div>
          ))}
          <form className="chat-input" onSubmit={enviar}>
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribí un mensaje…"
              maxLength={1000}
            />
            <button type="submit" aria-label="Enviar"><Icon name="send" size={15} /></button>
          </form>
        </div>
      </aside>
    </div>
  );
}
