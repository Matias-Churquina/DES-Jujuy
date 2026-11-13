import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Spinner } from '@/components/ui';
import DestinoSelect from '@/components/DestinoSelect';
import Icon from '@/components/Icon';
import { useToast } from '@/components/Toast';
import type { Viaje, Destino } from '@/types';
import { useNavigate } from 'react-router-dom';

function saludo() {
  const h = new Date().getHours();
  if (h < 12) return 'BUEN DÍA';
  if (h < 20) return 'BUENAS TARDES';
  return 'BUENAS NOCHES';
}

export default function BuscarViajes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservando, setReservando] = useState<number | null>(null);
  const [origen, setOrigen] = useState<Destino | null>(null);
  const [destino, setDestino] = useState<Destino | null>(null);
  const [asientos, setAsientos] = useState(1);
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [confirmando, setConfirmando] = useState<Viaje | null>(null);

  const idPasajero = user?.pasajero?.idPasajero;

  const buscarCon = (o: Destino, d: Destino, f?: string) => {
    setLoading(true);
    api.get<Viaje[]>('/viajes/disponibles', {
      params: { origen: o.idDestino, destino: d.idDestino, fecha: f || fecha },
    })
      .then((r) => setViajes(r.data))
      .catch(() => toast('error', 'Error al buscar viajes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get<Destino[]>('/destinos').then((r) => {
      setDestinos(r.data);
      const ssj = r.data.find((d) => d.nombre === 'San Salvador de Jujuy');
      const perico = r.data.find((d) => d.nombre === 'Perico');
      if (ssj) setOrigen(ssj);
      if (perico) setDestino(perico);
      if (ssj && perico) buscarCon(ssj, perico);
      else setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buscar = () => {
    if (!origen || !destino) {
      toast('warning', 'Seleccioná origen y destino');
      return;
    }
    buscarCon(origen, destino);
  };

  const reservar = async (viaje: Viaje, canalPago: 'EFECTIVO' | 'LINK') => {
    if (!idPasajero) { toast('error', 'No se encontró tu perfil de pasajero'); return; }
    if (canalPago === 'LINK') { setConfirmando(viaje); return; }
    setReservando(viaje.idViaje);
    try {
      const r = await api.post('/reservas', {
        idPasajero,
        idViaje: viaje.idViaje,
        cantidadAsientos: asientos,
        canalPago,
      });
      void r;
      toast('success', 'Reserva confirmada — pagás en efectivo al chofer');
      navigate('/pasajero/reservas');
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'No se pudo crear la reserva';
      toast(status === 409 ? 'warning' : 'error', msg);
      buscar();
    } finally {
      setReservando(null);
    }
  };

  const confirmarPagoMP = async () => {
    const viaje = confirmando;
    if (!viaje || !idPasajero) return;
    setReservando(viaje.idViaje);
    try {
      const r = await api.post('/reservas', {
        idPasajero,
        idViaje: viaje.idViaje,
        cantidadAsientos: asientos,
        canalPago: 'LINK',
      });
      const p = await api.post(`/pagos/preferencia/${r.data.idReserva}`);
      window.location.href = p.data.initPoint;
      return;
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'No se pudo crear la reserva';
      toast(status === 409 ? 'warning' : 'error', msg);
      setConfirmando(null);
      buscar();
    } finally {
      setReservando(null);
    }
  };

  const rutasFrecuentes = [
    ['San Salvador de Jujuy', 'Perico', '35 min'],
    ['San Salvador de Jujuy', 'El Carmen', '45 min'],
    ['San Salvador de Jujuy', 'Palpalá', '25 min'],
  ];

  const rutaRapida = (o: string, d: string) => {
    const de = destinos.find((x) => x.nombre === o);
    const pa = destinos.find((x) => x.nombre === d);
    if (!de || !pa) return;
    setOrigen(de);
    setDestino(pa);
    buscarCon(de, pa);
  };

  return (
    <div className="passenger-home">
      <section className="welcome-row">
        <div>
          <span className="eyebrow">{saludo()}</span>
          <h2>Hola, {user?.nombre}. ¿A dónde vamos?</h2>
          <p>Encontrá tu próximo viaje, fácil y seguro.</p>
        </div>
        <div className="weather">
          <span className="sun-orb" />
          <div>
            <strong>24°</strong>
            <span>Despejado en Jujuy</span>
          </div>
        </div>
      </section>

      <section className="search-card card">
        <div className="search-heading">
          <div>
            <h3>Buscá tu próximo viaje</h3>
            <p>Elegí origen, destino y cuándo querés viajar.</p>
          </div>
          <span className="badge success"><span className="badge-dot" />Viajes disponibles</span>
        </div>
        <div className="route-fields">
          <DestinoSelect
            label="ORIGEN"
            value={origen}
            onChange={setOrigen}
            destinos={destinos}
            excluir={destino?.idDestino}
            dot="origin"
          />
          <button
            className="swap-button"
            onClick={() => { const o = origen; setOrigen(destino); setDestino(o); }}
            aria-label="Intercambiar origen y destino"
          >
            <Icon name="swap" />
          </button>
          <DestinoSelect
            label="DESTINO"
            value={destino}
            onChange={setDestino}
            destinos={destinos}
            excluir={origen?.idDestino}
            dot="destination"
          />
        </div>
        <div className="search-options">
          <label>
            <span>FECHA</span>
            <div className="input-box">
              <Icon name="calendar" />
              <input
                type="date"
                value={fecha}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </label>
          <label>
            <span>ASIENTOS</span>
            <div className="input-box">
              <Icon name="seat" />
              <select value={asientos} onChange={(e) => setAsientos(Number(e.target.value))}>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} pasajero{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </label>
          <button className="primary-button search-button" onClick={buscar} disabled={!origen || !destino}>
            <Icon name="search" />
            Buscar viajes
          </button>
        </div>
      </section>

      {/* Resultados */}
      <section className="section-block">
        {loading ? <Spinner /> : viajes.length === 0 ? (
          <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No hay viajes disponibles para ese recorrido. Probá con otra ruta.
          </div>
        ) : (
          <div className="results-grid">
            {viajes.map((v) => (
              <div className="trip-card card" key={v.idViaje}>
                <div className="trip-route">
                  <strong>{v.origen?.nombre} <span>→</span> {v.destino?.nombre}</strong>
                  <span className="badge success"><span className="badge-dot" />{v.estadoViaje}</span>
                </div>
                <div className="trip-meta">
                  <span><Icon name="calendar" size={14} />{v.fechaSalida} · {v.horaSalida}</span>
                  <span><Icon name="users" size={14} />{v.chofer?.usuario?.nombre} {v.chofer?.usuario?.apellido} · ⭐ {v.chofer?.calificacion}</span>
                  {v.auto && <span><Icon name="car" size={14} />{v.auto.marca} {v.auto.modelo} · {v.auto.patente}</span>}
                  <span><Icon name="seat" size={14} />{v.asientosDisponibles} asientos libres</span>
                </div>
                <div className="trip-footer">
                  <strong className="trip-price">${v.tarifaPorAsiento}<small>/asiento</small></strong>
                  <div className="trip-actions">
                    <button
                      className="secondary-button"
                      disabled={reservando === v.idViaje || v.asientosDisponibles === 0}
                      onClick={() => reservar(v, 'EFECTIVO')}
                    >
                      {reservando === v.idViaje ? 'Reservando…' : 'Efectivo'}
                    </button>
                    <button
                      className="primary-button"
                      disabled={reservando === v.idViaje || v.asientosDisponibles === 0}
                      onClick={() => reservar(v, 'LINK')}
                    >
                      MercadoPago
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h3>Destinos frecuentes</h3>
            <p>Volvé a viajar con un toque.</p>
          </div>
        </div>
        <div className="quick-routes">
          {rutasFrecuentes.map((r, i) => (
            <button className="route-card card" key={r[1]} onClick={() => rutaRapida(r[0], r[1])}>
              <div className={`route-icon route-${i}`}>
                <Icon name="route" />
              </div>
              <div className="route-copy">
                <strong>{r[0].replace(' de Jujuy', '')} <span>→</span> {r[1]}</strong>
                <span><Icon name="clock" size={14} />{r[2]} aprox.</span>
              </div>
              <Icon name="chevron" />
            </button>
          ))}
        </div>
      </section>

      {confirmando && (
        <div className="confirm-overlay" onClick={() => setConfirmando(null)}>
          <div className="card confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, marginBottom: 4 }}>Confirmar reserva</h3>
            <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 14 }}>
              Revisá el detalle antes de pagar con MercadoPago.
            </p>
            <div className="confirm-rows">
              <div><span>Viaje</span><strong>{confirmando.origen?.nombre} → {confirmando.destino?.nombre}</strong></div>
              <div><span>Fecha</span><strong>{confirmando.fechaSalida} · {confirmando.horaSalida?.slice(0, 5)}</strong></div>
              <div><span>Asientos</span><strong>{asientos}</strong></div>
              <div className="confirm-total"><span>Total a pagar</span><strong>${(asientos * Number(confirmando.tarifaPorAsiento)).toLocaleString('es-AR')}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="secondary-button" style={{ flex: 1 }} onClick={() => setConfirmando(null)}>
                Volver
              </button>
              <button className="primary-button" style={{ flex: 1 }} disabled={reservando === confirmando.idViaje} onClick={confirmarPagoMP}>
                {reservando === confirmando.idViaje ? 'Redirigiendo…' : 'Pagar con MercadoPago'}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="promo-card" onClick={() => navigate('/pasajero/paqueteria')} style={{ cursor: 'pointer' }}>
        <div>
          <span className="badge violet"><span className="badge-dot" />NUEVO</span>
          <h3>Ahora tus paquetes también viajan con DES</h3>
          <p>Envíos rápidos con seguimiento en tiempo real.</p>
          <button>
            Enviar un paquete <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="parcel-illustration">
          <div className="parcel-box">
            <Icon name="package" size={42} />
          </div>
          <span className="parcel-path" />
        </div>
      </section>
    </div>
  );
}
