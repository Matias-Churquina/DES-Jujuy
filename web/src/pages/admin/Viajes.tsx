import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PageHeader, Spinner, Badge, EmptyState } from '@/components/ui';
import type { Viaje } from '@/types';

const colorByEstado: Record<string, string> = {
  ABIERTO: 'green', EN_CURSO: 'blue', COMPLETO: 'purple',
  FINALIZADO: 'gray', CANCELADO: 'red',
};

export default function Viajes() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Viaje[]>('/viajes').then((r) => setViajes(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Viajes" subtitle="Todos los viajes de la plataforma" />
      {viajes.length === 0 ? <EmptyState message="No hay viajes" /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Recorrido</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Fecha</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Chofer</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Asientos</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Tarifa</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {viajes.map((v) => (
                <tr key={v.idViaje} className="hover:bg-gray-50 dark:hover:bg-gray-700/60">
                  <td className="px-5 py-3 font-medium">{v.origen?.nombre} → {v.destino?.nombre}</td>
                  <td className="px-5 py-3">{v.fechaSalida} {v.horaSalida}</td>
                  <td className="px-5 py-3">{v.chofer?.usuario?.nombre} {v.chofer?.usuario?.apellido}</td>
                  <td className="px-5 py-3">{v.asientosDisponibles}</td>
                  <td className="px-5 py-3 font-semibold text-primary-600">${v.tarifaPorAsiento}</td>
                  <td className="px-5 py-3"><Badge color={colorByEstado[v.estadoViaje] || 'gray'}>{v.estadoViaje}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
