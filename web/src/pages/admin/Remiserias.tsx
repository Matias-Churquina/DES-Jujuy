import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, PageHeader, Spinner, Badge, EmptyState } from '@/components/ui';
import type { Remiseria } from '@/types';

export default function Remiserias() {
  const [remiserias, setRemiserias] = useState<Remiseria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Remiseria[]>('/remiserias').then((r) => setRemiserias(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title="Remiserías" subtitle="Tenants registrados en la plataforma" />
      {remiserias.length === 0 ? <EmptyState message="No hay remiserías registradas" /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {remiserias.map((r) => (
            <Card key={r.idRemiseria}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold">{r.nombre}</h3>
                <Badge color={r.estado === 'ACTIVA' ? 'green' : 'gray'}>{r.estado}</Badge>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 space-y-1">
                <p>CUIT: {r.cuit}</p>
                <p>📞 {r.telefono}</p>
                <p>✉️ {r.email}</p>
                {r.direccion && <p>📍 {r.direccion}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
