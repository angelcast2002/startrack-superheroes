import { useEffect, useMemo, useState } from 'react';
import { useFavorites } from '../store/favorites';
import type { Superhero } from '../interfaces/hero';
import HeroCard from '../components/HeroCard';
import Logo from '../assets/logo/logo.svg?react';
import { fetchSuperheroes } from '../services/superheroesService';

const LikedHeroes = () => {
  const [favorites, setFavorites] = useFavorites(); // Superhero[]
  const [data, setData] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    (async () => {
      try {
        const heroes = await fetchSuperheroes({ signal: ac.signal });
        if (!mounted || ac.signal.aborted) return;
        setData(heroes);
      } catch (e: any) {
        if (e?.name === 'AbortError') return; // <- ignora aborts
        setError(e?.message ?? 'Error al obtener datos');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  // 2) Set para saber si un id está en favoritos
  const idsFav = useMemo(() => new Set(favorites.map((h) => h.id)), [favorites]);

  // 3) Si quieres mostrar **solo** favoritos, filtra contra `data`
  const liked = useMemo(() => data.filter((h) => idsFav.has(h.id)), [data, idsFav]);

  const handleToggle = (hero: Superhero) => {
    setFavorites((prev) => {
      const has = prev.some((h) => h.id === hero.id);
      return has ? prev.filter((h) => h.id !== hero.id) : [...prev, hero];
    });
  };

  if (loading) return <div className="p-6 text-neutral-300">Cargando héroes…</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-10 pb-[50px] px-[129px] items-center font-poppins">
      <div className="flex justify-center p-14">
        <Logo />
      </div>

      <div className="grid w-full max-w-7xl justify-center grid-cols-[repeat(auto-fit,285px)] gap-4">
        {liked.map((hero) => (
          <HeroCard key={hero.id} hero={hero} isFav onToggle={handleToggle} />
        ))}
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-row justify-between">
          <p className='text-lg font-bold truncate'>All superheroes</p>
          <div>Buscar</div>
        </div>
        <div className="grid w-full justify-center md:justify-between grid-cols-[repeat(auto-fit,285px)] gap-4">
          {data.map((hero) => (
            <HeroCard key={hero.id} hero={hero} isFav={idsFav.has(hero.id)} onToggle={handleToggle} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedHeroes;
