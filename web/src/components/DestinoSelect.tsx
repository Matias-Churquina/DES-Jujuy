import React, { useState, useRef, useEffect } from 'react';
import type { Destino } from '@/types';

export default function DestinoSelect({
  label,
  value,
  onChange,
  destinos,
  placeholder = 'Elegí una localidad',
  excluir,
  dot = 'origin',
}: {
  label: string;
  value: Destino | null;
  onChange: (d: Destino | null) => void;
  destinos: Destino[];
  placeholder?: string;
  excluir?: number;
  dot?: 'origin' | 'destination';
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const opciones = destinos.filter(
    (d) =>
      d.idDestino !== excluir &&
      d.nombre.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <label className="destino-field" ref={ref as any}>
      <span>{label}</span>
      <div
        className="input-box destino-input"
        onClick={() => setOpen(true)}
        role="combobox"
        aria-expanded={open}
      >
        <span className={`location-dot ${dot}`} />
        {open ? (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={value?.nombre || placeholder}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={value ? 'destino-value' : 'destino-placeholder'}>
            {value?.nombre || placeholder}
          </span>
        )}
        <span className="destino-caret">▾</span>
      </div>

      {open && (
        <div className="destino-menu">
          {opciones.length === 0 ? (
            <div className="destino-empty">Sin resultados</div>
          ) : (
            opciones.map((d) => (
              <button
                key={d.idDestino}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onChange(d);
                  setOpen(false);
                  setQuery('');
                }}
                className={value?.idDestino === d.idDestino ? 'selected' : ''}
              >
                {d.nombre}
              </button>
            ))
          )}
        </div>
      )}
    </label>
  );
}
