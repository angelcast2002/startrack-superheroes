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
    // <div className="mx-auto max-w-4xl p-6">
    //   <header className="mb-4 flex items-center justify-between">
    //     <h1 className="text-2xl font-bold">Liked Heroes</h1>
    //     <span className="rounded-lg border border-neutral-700 px-3 py-1 text-sm text-neutral-300">{favorites.length} favoritos</span>
    //   </header>

    //   {favorites.length === 0 ? (
    //     <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-neutral-400">Aún no tienes favoritos. Ve a la lista general y marca algunos con ★</div>
    //   ) : (
    //     <ul className="space-y-2">
    //       {favorites.map((hero) => (
    //         <li key={hero.id}>
    //           <HeroCard hero={hero} isFav={idsFav.has(hero.id)} onToggle={handleToggle} />
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
    <div className='flex flex-col gap-10 pb-[83px] px-[129px]'>
      <div className="flex justify-center p-14">
        <Logo />
      </div>
      <div>
        {liked.map((hero) => (
          <HeroCard key={hero.id} hero={hero} isFav onToggle={handleToggle} />
        ))}
      </div>
      <div className='flex flex-col gap-[15px]'>
        {data.map((hero) => (
          <HeroCard key={hero.id} hero={hero} isFav={idsFav.has(hero.id)} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
};

export default LikedHeroes;
