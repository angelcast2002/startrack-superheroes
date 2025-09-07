import type { Superhero } from '../interfaces/hero';

const API_ALL = 'https://akabab.github.io/superhero-api/api/all.json';
const TTL_MS = 30 * 60 * 1000;

let _cache: Superhero[] | null = null;
let _cachedAt = 0;


const getJSON = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
  return res.json() as Promise<T>;
};

/**
 * Obtiene todos los héroes (usa cache por 30 min).
 * @param opts.force fuerza refetch ignorando cache.
 */
export const fetchSuperheroes = async (opts?: { signal?: AbortSignal; force?: boolean }): Promise<Superhero[]> => {
  const now = Date.now();
  const fresh = _cache && now - _cachedAt < TTL_MS;

  if (!opts?.force && fresh) return _cache!;

  const data = await getJSON<Superhero[]>(API_ALL, opts?.signal);
  _cache = data;
  _cachedAt = now;
  return _cache;
};

// /** Devuelve un héroe por id (usa cache si ya existe) */
// export const getHeroById = async (id: number, opts?: { signal?: AbortSignal }): Promise<Superhero | undefined> => {
//   const list = await fetchSuperheroes(opts);
//   return list.find((h) => h.id === id);
// };

/** Búsqueda por name o fullName (case-insensitive) */
export const searchHeroes = async (q: string, opts?: { signal?: AbortSignal }): Promise<Superhero[]> => {
  const list = await fetchSuperheroes(opts);
  const s = q.trim().toLowerCase();
  if (!s) return list;
  return list.filter((h) => (h.name ?? '').toLowerCase().includes(s) || (h.biography?.fullName ?? '').toLowerCase().includes(s));
};

// /** Cálculo sencillo del "power score" (promedio de stats válidos) */
// export const powerScore = (h: Superhero): number => {
//   const stats = h.powerstats ?? {};
//   const vals = Object.values(stats)
//     .map((v) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v)))
//     .filter((n) => Number.isFinite(n)) as number[];
//   if (!vals.length) return 0;
//   return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
// };

// /** Permite invalidar manualmente el cache (p.ej., para revalidar) */
// export const invalidateHeroesCache = (): void => {
//   _cache = null;
//   _cachedAt = 0;
// };
