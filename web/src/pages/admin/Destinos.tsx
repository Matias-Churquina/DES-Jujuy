import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PageHeader, Spinner, Badge, Button, EmptyState, Input, Card } from '@/components/ui';
import { useToast } from '@/components/Toast';
import type { Destino } from '@/types';

const FORM_VACIO = { nombre: '', latitud: '', longitud: '' };

export default function AdminDestinos() {
  const { toast } = useToast();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [editando, setEditando] = useState<Destino | null>(null);

  const cargar = () => {
    setLoading(true);
    api.get<Destino[]>('/destinos', { params: { todos: 'true' } })
      .then((r) => setDestinos(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  const guardar = async () => {
    const payload = {
      nombre: form.nombre.trim(),
      latitud: form.latitud ? Number(form.latitud) : undefined,
      longitud: form.longitud ? Number(form.longitud) : undefined,
    };
    try {
      if (editando) {
        await api.patch(`/destinos/${editando.idDestino}`, payload);
      } else {
        await api.post('/destinos', payload);
      }
      setForm(FORM_VACIO);
      setEditando(null);
      toast('success', editando ? 'Destino actualizado' : 'Destino creado');
      cargar();
    } catch (err: any) {
      toast('error', err.response?.data?.message || 'No se pudo guardar el destino');
    }
  };

  const editar = (d: Destino) => {
    setEditando(d);
    setForm({
      nombre: d.nombre,
      latitud: d.latitud?.toString() ?? '',
      longitud: d.longitud?.toString() ?? '',
    });
  };

  const toggleActivo = async (d: Destino) => {
    await api.patch(`/destinos/${d.idDestino}`, { activo: !d.activo });
    cargar();
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Destinos" subtitle="Localidades disponibles para origen y destino de viajes" />

      <Card className="mb-6">
        <h3 className="font-semibold mb-3">{editando ? `Editar: ${editando.nombre}` : 'Nuevo destino'}</h3>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Humahuaca" />
          <Input label="Latitud" value={form.latitud} onChange={(e) => setForm({ ...form, latitud: e.target.value })} placeholder="-23.2056" />
          <Input label="Longitud" value={form.longitud} onChange={(e) => setForm({ ...form, longitud: e.target.value })} placeholder="-65.3506" />
          <div className="flex gap-2">
            <Button onClick={guardar} disabled={!form.nombre.trim()}>{editando ? 'Guardar' : 'Agregar'}</Button>
            {editando && <Button variant="ghost" onClick={() => { setEditando(null); setForm(FORM_VACIO); }}>Cancelar</Button>}
          </div>
        </div>
      </Card>

      {destinos.length === 0 ? <EmptyState message="No hay destinos cargados" /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Nombre</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Coordenadas</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Estado</th>
                <th className="text-right px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {destinos.map((d) => (
                <tr key={d.idDestino} className="hover:bg-gray-50 dark:hover:bg-gray-700/60">
                  <td className="px-5 py-3 font-medium">{d.nombre}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    {d.latitud != null && d.longitud != null ? `${d.latitud}, ${d.longitud}` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <Badge color={d.activo ? 'green' : 'gray'}>{d.activo ? 'Activo' : 'Inactivo'}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <Button variant="ghost" onClick={() => editar(d)}>Editar</Button>
                    <Button variant={d.activo ? 'danger' : 'secondary'} onClick={() => toggleActivo(d)}>
                      {d.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
