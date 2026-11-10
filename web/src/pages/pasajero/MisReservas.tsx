import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Spinner } from '@/components/ui';
import { useToast } from '@/components/Toast';
import Icon from '@/components/Icon';
import type { Reserva } from '@/types';

const tono: Record<string, string> = {
  CONFIRMADA: 'success', PENDIENTE: 'warning', CANCELADA: 'danger',
  UTILIZADA: '', NO_PRESENTADO: 'danger', PAGADO: 'success',
};

export default function MisReservas() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState<number | null>(null);
  const [pagando, setPagando] = useState<number | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<number | null>(null);
  const [params] = useSearchParams();
  const pagoMsg = params.get('pago');
  const idPasajero = user?.pasajero?.idPasajero;

  const cargar = () => {
    if (!idPasajero) { setLoading(false); return; }
    api.get<Reserva[]>(`/reservas/pasajero/${idPasajero}`)
      .then((r) => setReservas(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(cargar, [idPasajero]);

  useEffect(() => {
    if (pagoMsg === 'ok') toast('success', 'Pago confirmado por MercadoPago');
    else if (pagoMsg === 'error') toast('error', 'El pago fue rechazado. Podés reintentar desde acá.');
    else if (pagoMsg === 'pendiente') toast('warning', 'El pago quedó pendiente de confirmación');
  }, [pagoMsg]);

  const cancelar = async (idReserva: number) => {
    setCancelando(idReserva);
    try {
      await api.patch(`/reservas/${idReserva}/cancelar`);
      toast('info', 'Reserva cancelada — los asientos fueron liberados');
      setCancelConfirm(null);
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo cancelar');
    } finally {
      setCancelando(null);
    }
  };

  const pagarMP = async (idReserva: number) => {
    setPagando(idReserva);
    try {
      const p = await api.post(`/pagos/preferencia/${idReserva}`);
      window.location.href = p.data.initPoint;
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo crear el pago');
      setPagando(null);
    }
  };

  if (loading) return <Spinner />;

  const activas = reservas.filter((r) => r.estadoReserva === 'CONFIRMADA' || r.estadoReserva === 'PENDIENTE');
  const historial = reservas.filter((r) => r.estadoReserva !== 'CONFIRMADA' && r.estadoReserva !== 'PENDIENTE');

  const BookingCard = ({ r }: { r: Reserva }) => {
    const v = r.viaje;
    const fecha = v?.fechaSalida ? new Date(v.fechaSalida + 'T00:00:00') : null;
    return (
      <div className="booking-card card">
        <div className="booking-date">
          <span>{fecha?.toLocaleDateString('es-AR', { weekday: 'short' }) || ''}</span>
          <strong>{fecha?.getDate() || ''}</strong>
          <small>{fecha?.toLocaleDateString('es-AR', { month: 'short' }) || ''}</small>
        </div>
        <div className="booking-route">
          <div className="timeline-dots">
            <i /><span /><i />
          </div>
          <div>
            <strong>{v?.origen?.nombre} → {v?.destino?.nombre}</strong>
            <span>{v?.horaSalida?.slice(0, 5)} · {r.cantidadAsientos} asiento{r.cantidadAsientos > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="booking-driver">
          <div className="mini-avatar">{v?.chofer?.usuario?.nombre?.[0]}{v?.chofer?.usuario?.apellido?.[0]}</div>
          <div>
            <strong>{v?.chofer?.usuario?.nombre} {v?.chofer?.usuario?.apellido}</strong>
            <span>★ {v?.chofer?.calificacion}</span>
          </div>
        </div>
        <div className="booking-price">
          <strong>${Number(r.importeTotal).toLocaleString('es-AR')}</strong>
          <div style={{ display: 'flex', gap: 5, marginTop: 5 }}>
            <span className={`badge ${tono[r.estadoReserva] || ''}`}><span className="badge-dot" />{r.estadoReserva}</span>
            <span className={`badge ${r.estadoPago === 'PAGADO' ? 'success' : 'warning'}`}><span className="badge-dot" />{r.estadoPago}</span>
          </div>
        </div>
        <div className="booking-actions">
          {r.canalPago === 'LINK' && r.estadoPago !== 'PAGADO' && r.estadoReserva === 'CONFIRMADA' && (
            <button onClick={() => pagarMP(r.idReserva)} disabled={pagando === r.idReserva}>
              {pagando === r.idReserva ? 'Redirigiendo…' : 'Pagar con MercadoPago'}
            </button>
          )}
          {(r.estadoReserva === 'CONFIRMADA' || r.estadoReserva === 'PENDIENTE') && (
            <>
              <button onClick={() => navigate('/pasajero/viaje')}>
                <Icon name="route" size={13} /> Viaje
              </button>
              <button className="danger-link" onClick={() => setCancelConfirm(r.idReserva)}>
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-intro">
        <h2>Mis reservas</h2>
        <p>Tus viajes activos e historial.</p>
      </div>

      <h3 style={{ fontSize: 13, marginBottom: 10 }}>Activas ({activas.length})</h3>
      <div className="booking-list">
        {activas.length === 0 ? (
          <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
            No tenés reservas activas. <button className="text-button" onClick={() => navigate('/pasajero')}>Buscar viajes →</button>
          </div>
        ) : activas.map((r) => <BookingCard key={r.idReserva} r={r} />)}
      </div>

      {historial.length > 0 && (
        <>
          <h3 style={{ fontSize: 13, margin: '26px 0 10px' }}>Historial</h3>
          <div className="booking-list">
            {historial.map((r) => <BookingCard key={r.idReserva} r={r} />)}
          </div>
        </>
      )}

      {cancelConfirm && (
        <div className="confirm-overlay" onClick={() => setCancelConfirm(null)}>
          <div className="card confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, marginBottom: 4 }}>Cancelar reserva</h3>
            <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 14 }}>
              Se liberarán los asientos reservados. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="secondary-button" style={{ flex: 1 }} onClick={() => setCancelConfirm(null)}>
                Volver
              </button>
              <button className="primary-button" style={{ flex: 1, background: 'var(--danger)' }} disabled={cancelando === cancelConfirm} onClick={() => cancelar(cancelConfirm)}>
                {cancelando === cancelConfirm ? 'Cancelando…' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
