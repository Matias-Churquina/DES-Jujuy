import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Card, PageHeader, Spinner, Badge, Button, EmptyState, Input } from '@/components/ui';
import { useToast } from '@/components/Toast';
import DestinoSelect from '@/components/DestinoSelect';
import type { Paquete, Destino } from '@/types';

const colorEstado: Record<string, string> = {
  PENDIENTE_RECOGIDA: 'yellow', RECIBIDO: 'blue', ASIGNADO: 'purple', EN_TRANSITO: 'blue',
  ENTREGADO: 'green', INCIDENCIA: 'red', DEVUELTO: 'gray', CANCELADO: 'red',
};

const FORM_VACIO = {
  descripcion: '', peso: '', valorDeclarado: '500', prioridad: 'NORMAL',
  origenTel: '', destinoTel: '', notas: '',
};

// Tarifario demo: base según distancia (Haversine entre paradas) y
// +$500 por cada 500g adicionales sobre el primer kilo.
const UMBRAL_KM = 40;
const BASE_CERCA = 2000;
const BASE_LEJOS = 4000;
const EXTRA_POR_500G = 500;

function distanciaKm(a: Destino, b: Destino): number {
  const R = 6371;
  const dLat = (((b.latitud ?? 0) - (a.latitud ?? 0)) * Math.PI) / 180;
  const dLng = (((b.longitud ?? 0) - (a.longitud ?? 0)) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((((a.latitud ?? 0)) * Math.PI) / 180) *
      Math.cos((((b.latitud ?? 0)) * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function calcularPrecio(pesoKg: number, km: number): { base: number; extra: number; total: number; km: number } {
  const base = km > UMBRAL_KM ? BASE_LEJOS : BASE_CERCA;
  const extra = pesoKg > 1 ? Math.ceil((pesoKg - 1) / 0.5) * EXTRA_POR_500G : 0;
  return { base, extra, total: base + extra, km };
}

export default function Paqueteria() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [origen, setOrigen] = useState<Destino | null>(null);
  const [destino, setDestino] = useState<Destino | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');

  const idPasajero = user?.pasajero?.idPasajero;

  const cargar = () => {
    if (!idPasajero) { setLoading(false); return; }
    api.get<Paquete[]>(`/paquetes/pasajero/${idPasajero}`)
      .then((r) => setPaquetes(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
    api.get<Destino[]>('/destinos').then((r) => setDestinos(r.data));
  }, [idPasajero]);

  const enviar = async () => {
    if (!idPasajero || !origen || !destino) return;
    setGuardando(true);
    try {
      const r = await api.post('/paquetes', {
        idPasajeroRemitente: idPasajero,
        idRemiseria: 1,
        descripcion: form.descripcion,
        peso: form.peso ? Number(form.peso) : undefined,
        prioridad: form.prioridad,
        tarifa: precio?.total,
        valorDeclarado: form.valorDeclarado ? Number(form.valorDeclarado) : undefined,
        origen: {
          direccion: `${origen.nombre} (parada)`,
          latitud: origen.latitud, longitud: origen.longitud,
          telefono: form.origenTel,
        },
        destino: {
          direccion: `${destino.nombre} (parada)`,
          latitud: destino.latitud, longitud: destino.longitud,
          telefono: form.destinoTel,
        },
        notas: form.notas || undefined,
      });
      setNuevoCodigo(r.data.codigoSeguimiento);
      setForm(FORM_VACIO);
      setOrigen(null);
      setDestino(null);
      setShowForm(false);
      toast('success', `Envío registrado — ticket ${r.data.codigoSeguimiento}`);
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo registrar el envío');
    } finally {
      setGuardando(false);
    }
  };

  const precio =
    origen && destino && origen.latitud != null && destino.latitud != null
      ? calcularPrecio(form.peso ? Number(form.peso) : 0, distanciaKm(origen, destino))
      : null;

  const puede =
    form.descripcion && origen && destino &&
    form.origenTel && form.destinoTel && precio != null;

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Paquetería" subtitle="Envíos con seguimiento por ticket"
        action={<Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cerrar' : '+ Enviar paquete'}</Button>} />

      {nuevoCodigo && (
        <Card className="mb-4 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200">
          <p className="font-semibold text-emerald-800">Tu ticket de seguimiento:</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="font-mono text-xl font-bold text-emerald-700">{nuevoCodigo}</span>
            <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(nuevoCodigo); toast('info', 'Código copiado'); }}>Copiar</Button>
            <Link to={`/track/${nuevoCodigo}`} className="text-sm text-primary-600 hover:underline">Ver seguimiento →</Link>
          </div>
        </Card>
      )}

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-semibold mb-4">Nuevo envío</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Descripción *" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Caja con libros, documentos" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Peso (kg)" type="number" min="0" step="0.1" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
              <Input label="Valor declarado ($)" type="number" min="0" value={form.valorDeclarado} onChange={(e) => setForm({ ...form, valorDeclarado: e.target.value })} placeholder="Valor del contenido" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prioridad</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value={form.prioridad} onChange={(e) => setForm({ ...form, prioridad: e.target.value })}>
                <option value="NORMAL">Normal</option>
                <option value="URGENTE">Urgente</option>
                <option value="FRAGIL">Frágil</option>
              </select>
            </div>
            <Input label="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} placeholder="Opcional" />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
              <p className="text-sm font-medium">📤 Origen (retiro en parada)</p>
              <DestinoSelect label="Localidad *" value={origen} onChange={setOrigen} destinos={destinos} excluir={destino?.idDestino} />
              <Input label="Teléfono de contacto *" value={form.origenTel} onChange={(e) => setForm({ ...form, origenTel: e.target.value })} placeholder="388..." />
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
              <p className="text-sm font-medium">📥 Destino (entrega en parada)</p>
              <DestinoSelect label="Localidad *" value={destino} onChange={setDestino} destinos={destinos} excluir={origen?.idDestino} />
              <Input label="Teléfono de contacto *" value={form.destinoTel} onChange={(e) => setForm({ ...form, destinoTel: e.target.value })} placeholder="388..." />
            </div>
          </div>
          {precio && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ~{Math.round(precio.km)} km · base ${precio.base.toLocaleString('es-AR')}
                {precio.extra > 0 && ` + $${precio.extra.toLocaleString('es-AR')} por peso`}
                <span className="block">Máx. 50×50×50 cm</span>
              </div>
              <strong className="text-lg">${precio.total.toLocaleString('es-AR')}</strong>
            </div>
          )}
          <div className="mt-4">
            <Button onClick={enviar} disabled={!puede || guardando}>
              {guardando ? 'Registrando...' : 'Registrar envío'}
            </Button>
          </div>
        </Card>
      )}

      <h2 className="text-lg font-semibold mb-3">Mis envíos</h2>
      {paquetes.length === 0 ? <EmptyState message="No registraste envíos" /> : (
        <div className="space-y-3">
          {paquetes.map((p) => (
            <Card key={p.idPaquete}>
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-mono font-bold text-primary-700">{p.codigoSeguimiento}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">{p.descripcion}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{p.origen?.direccion} → {p.destino?.direccion}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge color={colorEstado[p.estado]}>{p.estado.replace(/_/g, ' ')}</Badge>
                  <Link to={`/track/${p.codigoSeguimiento}`} className="text-xs text-primary-600 hover:underline">Seguimiento →</Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
