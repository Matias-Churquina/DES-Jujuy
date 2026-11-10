import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { PageHeader, Spinner, Badge, Button, EmptyState, Input, Card } from '@/components/ui';
import ChatWidget from '@/components/ChatWidget';
import { useToast } from '@/components/Toast';
import type { Viaje, Destino, Auto, Reserva } from '@/types';

const colorEstado: Record<string, string> = {
  ABIERTO: 'green',
  COMPLETO: 'purple',
  EN_CURSO: 'blue',
  FINALIZADO: 'gray',
  CANCELADO: 'red',
};

const FORM_VACIO = {
  idOrigen: '', idDestino: '', fechaSalida: '', horaSalida: '',
  tarifaPorAsiento: '800', asientosDisponibles: '4', idAuto: '',
};

export default function ChoferViajes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [autos, setAutos] = useState<Auto[]>([]);
  const [reservas, setReservas] = useState<Record<number, Reserva[]>>({});
  const [chatReserva, setChatReserva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const idChofer = user?.chofer?.idChofer;

  const cargar = () => {
    if (!idChofer) { setLoading(false); return; }
    api.get<Viaje[]>(`/choferes/${idChofer}/viajes`)
      .then((r) => setViajes(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
    api.get<Destino[]>('/destinos').then((r) => setDestinos(r.data));
    if (idChofer) {
      api.get(`/choferes/${idChofer}`).then((r) => setAutos(r.data.autos || []));
    }
  }, [idChofer]);

  const toggleReservas = async (viaje: Viaje) => {
    if (reservas[viaje.idViaje]) {
      setReservas((prev) => {
        const next = { ...prev };
        delete next[viaje.idViaje];
        return next;
      });
      return;
    }
    const r = await api.get<Reserva[]>(`/reservas/viaje/${viaje.idViaje}`);
    setReservas((prev) => ({ ...prev, [viaje.idViaje]: r.data }));
  };

  const cambiarEstado = async (viaje: Viaje, estado: string) => {
    try {
      await api.patch(`/viajes/${viaje.idViaje}/estado`, { estado });
      toast('info', `Viaje ${estado.toLowerCase().replace('_', ' ')}`);
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo cambiar el estado');
    }
  };

  const cobrarEfectivo = async (idReserva: number, idViaje: number) => {
    try {
      await api.patch(`/reservas/${idReserva}/pago-efectivo`);
      toast('success', 'Pago en efectivo registrado');
      const r = await api.get<Reserva[]>(`/reservas/viaje/${idViaje}`);
      setReservas((prev) => ({ ...prev, [idViaje]: r.data }));
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo registrar el pago');
    }
  };

  const crearViaje = async () => {
    setGuardando(true);
    try {
      await api.post('/viajes', {
        idChofer,
        idAuto: Number(form.idAuto),
        idOrigen: Number(form.idOrigen),
        idDestino: Number(form.idDestino),
        fechaSalida: form.fechaSalida,
        horaSalida: form.horaSalida,
        tarifaPorAsiento: Number(form.tarifaPorAsiento),
        asientosDisponibles: Number(form.asientosDisponibles),
      });
      setForm(FORM_VACIO);
      setShowForm(false);
      toast('success', 'Viaje publicado');
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo crear el viaje');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <Spinner />;

  const puedeCrear =
    form.idOrigen && form.idDestino && form.fechaSalida && form.horaSalida &&
    form.idAuto && Number(form.idOrigen) !== Number(form.idDestino);

  return (
    <>
      <PageHeader
        title="Mis Viajes"
        subtitle="Publicá y gestioná tus viajes"
        action={<Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cerrar' : '+ Nuevo viaje'}</Button>}
      />

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-semibold mb-4">Crear viaje</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <select
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              value={form.idOrigen}
              onChange={(e) => setForm({ ...form, idOrigen: e.target.value })}
            >
              <option value="">Origen...</option>
              {destinos.map((d) => <option key={d.idDestino} value={d.idDestino}>{d.nombre}</option>)}
            </select>
            <select
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              value={form.idDestino}
              onChange={(e) => setForm({ ...form, idDestino: e.target.value })}
            >
              <option value="">Destino...</option>
              {destinos.filter((d) => d.idDestino !== Number(form.idOrigen)).map((d) => (
                <option key={d.idDestino} value={d.idDestino}>{d.nombre}</option>
              ))}
            </select>
            <select
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              value={form.idAuto}
              onChange={(e) => setForm({ ...form, idAuto: e.target.value })}
            >
              <option value="">Auto...</option>
              {autos.map((a) => (
                <option key={a.idAuto} value={a.idAuto}>{a.marca} {a.modelo} ({a.patente}) — {a.capacidadAsientos} asientos</option>
              ))}
            </select>
            <Input label="Fecha" type="date" value={form.fechaSalida} onChange={(e) => setForm({ ...form, fechaSalida: e.target.value })} />
            <Input label="Hora" type="time" value={form.horaSalida} onChange={(e) => setForm({ ...form, horaSalida: e.target.value })} />
            <Input label="Tarifa por asiento ($)" type="number" min="1" value={form.tarifaPorAsiento} onChange={(e) => setForm({ ...form, tarifaPorAsiento: e.target.value })} />
            <Input label="Asientos" type="number" min="1" max={autos.find((a) => a.idAuto === Number(form.idAuto))?.capacidadAsientos || 8} value={form.asientosDisponibles} onChange={(e) => setForm({ ...form, asientosDisponibles: e.target.value })} />
          </div>
          <div className="mt-4">
            <Button onClick={crearViaje} disabled={!puedeCrear || guardando}>
              {guardando ? 'Creando...' : 'Publicar viaje'}
            </Button>
          </div>
        </Card>
      )}

      {viajes.length === 0 ? <EmptyState message="No tenés viajes aún" /> : (
        <div className="space-y-4">
          {viajes.map((v) => (
            <Card key={v.idViaje}>
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold">{v.origen?.nombre} → {v.destino?.nombre}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
                    📅 {v.fechaSalida} — 🕐 {v.horaSalida} — 🚗 {v.auto?.marca} {v.auto?.modelo} ({v.auto?.patente})
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    💺 {v.asientosDisponibles} libres — 📋 {v.reservas?.length || 0} reservas — ${v.tarifaPorAsiento}/asiento
                  </p>
                </div>
                <Badge color={colorEstado[v.estadoViaje] || 'gray'}>{v.estadoViaje}</Badge>
              </div>

              <div className="flex gap-2 mt-4 flex-wrap">
                {v.estadoViaje === 'ABIERTO' && (
                  <Button onClick={() => cambiarEstado(v, 'EN_CURSO')}>Iniciar viaje</Button>
                )}
                {v.estadoViaje === 'COMPLETO' && (
                  <Button onClick={() => cambiarEstado(v, 'EN_CURSO')}>Iniciar viaje</Button>
                )}
                {(v.estadoViaje === 'EN_CURSO') && (
                  <Button variant="secondary" onClick={() => cambiarEstado(v, 'FINALIZADO')}>Finalizar</Button>
                )}
                {(v.estadoViaje === 'ABIERTO' || v.estadoViaje === 'COMPLETO') && (
                  <Button variant="danger" onClick={() => cambiarEstado(v, 'CANCELADO')}>Cancelar</Button>
                )}
                <Button variant="ghost" onClick={() => toggleReservas(v)}>
                  {reservas[v.idViaje] ? 'Ocultar reservas' : `Reservas (${v.reservas?.length || 0})`}
                </Button>
              </div>

              {reservas[v.idViaje] && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  {reservas[v.idViaje].length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Sin reservas todavía</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          <th className="pb-2">Pasajero</th>
                          <th className="pb-2">Asientos</th>
                          <th className="pb-2">Total</th>
                          <th className="pb-2">Pago</th>
                          <th className="pb-2">Estado</th>
                          <th className="pb-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {reservas[v.idViaje].map((r) => (
                          <tr key={r.idReserva}>
                            <td className="py-2">{r.pasajero?.usuario ? `${r.pasajero.usuario.nombre} ${r.pasajero.usuario.apellido}` : `#${r.idPasajero}`}</td>
                            <td className="py-2">{r.cantidadAsientos}</td>
                            <td className="py-2 font-semibold">${r.importeTotal}</td>
                            <td className="py-2">{r.canalPago || '—'}</td>
                            <td className="py-2"><Badge color={r.estadoPago === 'PAGADO' ? 'green' : 'yellow'}>{r.estadoPago}</Badge></td>
                            <td className="py-2 text-right space-x-2">
                              {r.estadoReserva !== 'CANCELADA' && (
                                <Button variant="ghost" onClick={() => setChatReserva(r.idReserva)}>
                                  💬
                                </Button>
                              )}
                              {r.canalPago === 'EFECTIVO' && r.estadoPago !== 'PAGADO' && r.estadoReserva === 'CONFIRMADA' && (
                                <Button variant="secondary" onClick={() => cobrarEfectivo(r.idReserva, v.idViaje)}>
                                  Cobrar
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {chatReserva && (
        <ChatWidget
          idReserva={chatReserva}
          titulo={`Pasajero — Reserva #${chatReserva}`}
          onClose={() => setChatReserva(null)}
        />
      )}
    </>
  );
}
