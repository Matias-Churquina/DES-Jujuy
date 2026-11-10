import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, PageHeader, Spinner, Badge, EmptyState } from '@/components/ui';
import type { Chofer } from '@/types';

export default function Choferes() {
  const [choferes, setChoferes] = useState<Chofer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Chofer[]>('/choferes').then((r) => setChoferes(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Choferes" subtitle="Gestión de conductores de la plataforma" />
      {choferes.length === 0 ? <EmptyState message="No hay choferes registrados" /> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Chofer</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Licencia</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Autos</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Calificación</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {choferes.map((c) => (
                <tr key={c.idChofer} className="hover:bg-gray-50 dark:hover:bg-gray-700/60">
                  <td className="px-5 py-3">
                    <div className="font-medium">{c.usuario?.nombre} {c.usuario?.apellido}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{c.usuario?.email}</div>
                  </td>
                  <td className="px-5 py-3">{c.licenciaConducir}</td>
                  <td className="px-5 py-3">{c.autos?.length || 0}</td>
                  <td className="px-5 py-3">⭐ {c.calificacion}</td>
                  <td className="px-5 py-3">
                    <Badge color={c.estadoChofer === 'DISPONIBLE' ? 'green' : c.estadoChofer === 'EN_VIAJE' ? 'blue' : 'gray'}>
                      {c.estadoChofer}
                    </Badge>
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
