// OSRM público (gratis, sin key). Devuelve ruta y ETA entre dos puntos.
export interface RutaInfo {
  puntos: [number, number][];
  distanciaKm: number;
  duracionMin: number;
}

export async function obtenerRuta(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Promise<RutaInfo | null> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from.lng},${from.lat};${to.lng},${to.lat}` +
      `?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;
    return {
      puntos: route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number],
      ),
      distanciaKm: Math.round((route.distance / 1000) * 10) / 10,
      duracionMin: Math.round(route.duration / 60),
    };
  } catch {
    return null;
  }
}
