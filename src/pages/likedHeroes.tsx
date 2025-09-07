/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useFavorites } from '../store/favorites';
import type { Superhero } from '../interfaces/hero';
import HeroCard from '../components/HeroCard';
import Logo from '../assets/logo/logo.svg?react';
import { fetchSuperheroes } from '../services/superheroesService';
import SearchBar from '../components/SearchBar';
import HeartIcon from '../assets/big-heart/big-heart.svg?react';
import ArrowUp from '../assets/arrow-up/arrow-up.svg?react';

const LikedHeroes = () => {
  const [favorites, setFavorites] = useFavorites();
  const [data, setData] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [likedOpen, setLikedOpen] = useState(true); // <- controla colapso

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;
    (async () => {
      try {
        const heroes = await fetchSuperheroes({ signal: ac.signal });
        if (!mounted || ac.signal.aborted) return;
        setData(heroes);
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(e?.message ?? 'Error al obtener datos');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  const idsFav = useMemo(() => new Set(favorites.map((h) => h.id)), [favorites]);

  // Favoritos
  const liked = useMemo(() => data.filter((h) => idsFav.has(h.id)), [data, idsFav]);

  // Filtro por nombre y fullName
  const filteredAll = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    const base = s ? data.filter((h) => (h.name ?? '').toLowerCase().includes(s) || (h.biography?.fullName ?? '').toLowerCase().includes(s)) : data;

    // EXCLUIR favoritos para que "salten" a Liked
    return base.filter((h) => !idsFav.has(h.id));
  }, [data, searchTerm, idsFav]);

  const handleToggle = (hero: Superhero) => {
    setFavorites((prev) => {
      const has = prev.some((h) => h.id === hero.id);
      return has ? prev.filter((h) => h.id !== hero.id) : [...prev, hero];
    });
  };

  if (loading) return <div className="p-6 text-neutral-300">Loading heroes…</div>;
  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-10 pb-[50px] md:px-[129px] px-6 items-center font-poppins">
      <div className="flex justify-center p-14">
        <Logo />
      </div>

      {/* ====== Liked (colapsable) ====== */}
      <div className={`flex w-full flex-col rounded-2xl border border-[rgba(106,77,188,1)] p-4 ${likedOpen ? 'gap-8' : 'bg-[#6A4DBC47]'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6A4DBC]">
              <HeartIcon className="w-3.5 text-white" />
            </span>
            <p className="text-lg font-bold">Liked</p>
          </div>

          <button type="button" onClick={() => setLikedOpen((v) => !v)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[#282042] shadow-md">
            <ArrowUp
              className="w-6 text-white"
              style={{
                transform: likedOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform .3s ease',
              }}
            />
          </button>
        </div>

        {/* Contenido colapsable */}
        <div
          style={{
            maxHeight: likedOpen ? '1000px' : '0px',
            opacity: likedOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height .3s ease, opacity .3s ease',
          }}
        >
          {liked.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3 text-white/80">
              <HeartIcon className="w-9" />
              <p>You haven’t liked any superhero yet</p>
            </div>
          ) : (
            <div className="grid w-full max-w-7xl grid-cols-[repeat(auto-fit,285px)] justify-center gap-4">
              {liked.map((hero) => (
                <HeroCard key={hero.id} hero={hero} isFav onToggle={handleToggle} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====== All superheroes (excluye favoritos) ====== */}
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <p className="truncate text-lg font-bold">All superheroes</p>
          <SearchBar value={searchTerm} onChange={setSearchTerm} className="w-[285px] md:w-[371px]" />
        </div>

        {filteredAll.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 text-neutral-400">No results for “{searchTerm}”.</div>
        ) : (
          <div className="grid w-full grid-cols-[repeat(auto-fit,285px)] justify-center gap-4 md:justify-between">
            {filteredAll.map((hero) => (
              <HeroCard key={hero.id} hero={hero} isFav={idsFav.has(hero.id)} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedHeroes;
