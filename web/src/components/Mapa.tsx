import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTheme } from '@/lib/theme';

// Tiles OSM estándar (gratis, sin key) — monocromo vía filtros CSS.
const TILES_OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export interface Marcador {
  lat: number;
  lng: number;
  emoji: string; // clave del tipo (compat): 🏠 origen, 📍 destino, 🚗/🟢 chofer, 📦 paquete
  label?: string;
}

// Iconos tipo Lucide, SOLO el icono (sin círculo), colores de marca DES.
const MARKER_PATHS: Record<string, { svg: string; color: string; anchor: [number, number] }> = {
  '🏠': {
    color: '#6366F1',
    anchor: [15, 15],
    svg: '<circle cx="12" cy="12" r="8" fill="white" stroke="#6366F1" stroke-width="2.5"/><circle cx="12" cy="12" r="3.2" fill="#6366F1"/>',
  },
  '📍': {
    color: '#8B5CF6',
    anchor: [15, 28],
    svg: '<path d="M20 10c0 5.4-8 12-8 12S4 15.4 4 10a8 8 0 1 1 16 0Z" fill="#8B5CF6" stroke="white" stroke-width="1.6"/><circle cx="12" cy="10" r="3" fill="white"/>',
  },
  '🚗': {
    color: '#F59E0B',
    anchor: [16, 16],
    svg: '<path d="M5 16l1.7-5.2A2 2 0 0 1 8.6 9.5h6.8a2 2 0 0 1 1.9 1.3L19 16" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round"/><rect x="3.5" y="16" width="17" height="4.5" rx="2" fill="#F59E0B"/><circle cx="7.5" cy="20.5" r="1.6" fill="#7A3D00"/><circle cx="16.5" cy="20.5" r="1.6" fill="#7A3D00"/>',
  },
  '🟢': {
    color: '#F59E0B',
    anchor: [16, 16],
    svg: '<path d="M5 16l1.7-5.2A2 2 0 0 1 8.6 9.5h6.8a2 2 0 0 1 1.9 1.3L19 16" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round"/><rect x="3.5" y="16" width="17" height="4.5" rx="2" fill="#F59E0B"/><circle cx="7.5" cy="20.5" r="1.6" fill="#7A3D00"/><circle cx="16.5" cy="20.5" r="1.6" fill="#7A3D00"/>',
  },
  '📦': {
    color: '#6366F1',
    anchor: [15, 15],
    svg: '<path d="m12 3 8 4-8 4-8-4 8-4Z" fill="#6366F1"/><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" fill="none" stroke="#6366F1" stroke-width="2"/><path d="M12 11v10" stroke="white" stroke-width="2"/>',
  },
};

function icono(emoji: string) {
  const m = MARKER_PATHS[emoji] || MARKER_PATHS['📍'];
  return L.divIcon({
    className: 'map-marker-icon',
    html: `<svg width="30" height="30" viewBox="0 0 24 24" style="filter: drop-shadow(0 0 3px rgb(255 255 255 / .9)) drop-shadow(0 2px 4px rgb(0 0 0 / .3));" fill="none">${m.svg}</svg>`,
    iconSize: [30, 30],
    iconAnchor: m.anchor,
  });
}

function EmojiMarker({ m }: { m: Marcador }) {
  const icon = useMemo(() => icono(m.emoji), [m.emoji]);
  return <Marker position={[m.lat, m.lng]} icon={icon} />;
}

function AjustarBounds({ puntos }: { puntos: Marcador[] }) {
  const map = useMap();
  useEffect(() => {
    if (puntos.length > 1) {
      map.fitBounds(
        L.latLngBounds(puntos.map((p) => [p.lat, p.lng])),
        { padding: [50, 50] },
      );
    } else if (puntos.length === 1) {
      map.setView([puntos[0].lat, puntos[0].lng], 14);
    }
  }, [puntos, map]);
  return null;
}

export default function Mapa({
  marcadores,
  ruta = [],
  className = '',
}: {
  marcadores: Marcador[];
  ruta?: [number, number][];
  className?: string;
}) {
  const centro: [number, number] = [
    marcadores[0]?.lat ?? -24.18,
    marcadores[0]?.lng ?? -65.3,
  ];

  const [theme, setTheme] = useState(getTheme());
  useEffect(() => {
    const onTheme = () => setTheme(getTheme());
    window.addEventListener('des-theme', onTheme);
    return () => window.removeEventListener('des-theme', onTheme);
  }, []);

  return (
    <MapContainer
      center={centro}
      zoom={13}
      className={`rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 ${className}`}
      style={{ height: '100%', minHeight: 320, width: '100%' }}
    >
      <TileLayer
        key={theme}
        className={theme === 'dark' ? 'map-tiles-dark' : 'map-tiles-light'}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={TILES_OSM}
      />
      <AjustarBounds puntos={marcadores} />
      {marcadores.map((m, i) => (
        <EmojiMarker key={i} m={m} />
      ))}
      {ruta.length > 1 && (
        <Polyline positions={ruta} pathOptions={{ color: '#6366F1', weight: 4, opacity: 0.75 }} />
      )}
    </MapContainer>
  );
}
