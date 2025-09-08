/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFavorites } from '../store/favorites';
import type { Superhero } from '../interfaces/hero';
import HeroCard from '../components/HeroCard';
import HeroCardSkeleton from '../components/HeroCardSkeleton';
import HeroGridSkeleton from '../components/HeroGridSkeleton';
import Logo from '../assets/logo/logo.svg?react';
import { fetchSuperheroes } from '../services/superheroesService';
import SearchBar from '../components/SearchBar';
import HeartIcon from '../assets/big-heart/big-heart.svg?react';
import ArrowUp from '../assets/arrow-up/arrow-up.svg?react';
import VirtualGrid, { type VirtualGridHandle } from '../components/AllHeroesVirtualGrid';

const RECENT_MS = 8000;
const KEY_LIKED_OPEN = 'startrack:likedOpen';

const LikedHeroes = () => {
  const lastAddedIndexRef = useRef<number | null>(null);
  const likedGridRef = useRef<VirtualGridHandle | null>(null);

  const [favIds, , fav] = useFavorites(); 

  const [data, setData] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [likedOpen, setLikedOpen] = useState<boolean>(() => {
    const raw = localStorage.getItem(KEY_LIKED_OPEN);
    return raw === null ? true : raw === 'true';
  });
  useEffect(() => {
    localStorage.setItem(KEY_LIKED_OPEN, String(likedOpen));
  }, [likedOpen]);

  const [recentIds, setRecentIds] = useState<Set<number>>(new Set());
  const timersRef = useRef<Map<number, number>>(new Map());
  const markRecent = (id: number) => {
    setRecentIds((prev) => new Set(prev).add(id));
    const prevTimer = timersRef.current.get(id);
    if (prevTimer) window.clearTimeout(prevTimer);
    const tid = window.setTimeout(() => {
      setRecentIds((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
      timersRef.current.delete(id);
    }, RECENT_MS);
    timersRef.current.set(id, tid);
  };

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
      timersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  const idsFav = useMemo(() => new Set(favIds), [favIds]);

  const liked = useMemo(() => favIds.map((id) => data.find((h) => h.id === id)).filter(Boolean) as Superhero[], [favIds, data]);

  const filteredAll = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    const base = s ? data.filter((h) => (h.name ?? '').toLowerCase().includes(s) || (h.biography?.fullName ?? '').toLowerCase().includes(s)) : data;
    return base.filter((h) => !idsFav.has(h.id));
  }, [data, searchTerm, idsFav]);

  const handleToggle = (hero: Superhero) => {
    const isFav = idsFav.has(hero.id);
    if (!isFav) {
      lastAddedIndexRef.current = favIds.length;
      setLikedOpen(true);
      markRecent(hero.id);
      fav.add(hero.id);
    } else {
      setRecentIds((prev) => {
        const c = new Set(prev);
        c.delete(hero.id);
        return c;
      });
      const t = timersRef.current.get(hero.id);
      if (t) {
        clearTimeout(t);
        timersRef.current.delete(hero.id);
      }
      fav.remove(hero.id);
    }
  };

  useEffect(() => {
    if (lastAddedIndexRef.current == null) return;
    likedGridRef.current?.scrollToIndex(lastAddedIndexRef.current, 'center');
    lastAddedIndexRef.current = null;
  }, [liked]);

  if (loading) {
    return (
      <div className="flex flex-col gap-10 pb-[50px] md:px-[129px] px-6 items-center font-poppins">
        <div className="flex justify-center p-14">
          <Logo />
        </div>

        <div className="flex w-full flex-col rounded-2xl border border-[rgba(106,77,188,1)] p-4 gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6A4DBC]" />
              <p className="text-lg font-bold">Liked</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#282042]" />
          </div>
          <div className="grid w-full max-w-7xl grid-cols-[repeat(auto-fit,285px)] justify-center gap-4">
            <HeroCardSkeleton />
            <HeroCardSkeleton />
            <HeroCardSkeleton />
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <p className="truncate text-lg font-bold">All superheroes</p>
            <div className="h-10 w-[285px] md:w-[371px] rounded-lg bg-[#1F1B37]" />
          </div>
          <HeroGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-10 pb-[50px] md:px-[129px] px-6 items-center font-poppins">
      <div className="flex justify-center p-14">
        <Logo />
      </div>

      <div className={`flex w-full flex-col rounded-2xl border border-[rgba(106,77,188,1)] p-4 ${likedOpen ? 'gap-8' : 'bg-[#6A4DBC47]'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6A4DBC]">
              <HeartIcon className="w-3.5 text-white" />
            </span>
            <p className="text-lg font-bold">Liked</p>
          </div>

          <button type="button" onClick={() => setLikedOpen((v) => !v)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[#282042] shadow-md">
            <ArrowUp className="w-6 text-white" style={{ transform: likedOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform .3s ease' }} />
          </button>
        </div>

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
            <VirtualGrid
              ref={likedGridRef}
              items={liked}
              maxHeightPx={Math.floor(window.innerHeight * 0.5)}
              autoShrink
              className="bg-transparent"
              renderItem={(hero: Superhero) => <HeroCard hero={hero} isFav recent={recentIds.has(hero.id)} onToggle={handleToggle} />}
            />
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <p className="truncate text-lg font-bold">All superheroes</p>
          <SearchBar value={searchTerm} onChange={setSearchTerm} className="w-[285px] md:w-[371px]" />
        </div>

        {filteredAll.length === 0 ? (
          <div className="rounded-2xl bg-neutral-900/50 p-6 text-neutral-400">No results for “{searchTerm}”.</div>
        ) : (
          <VirtualGrid
            items={filteredAll}
            maxHeightPx={Math.floor(window.innerHeight * 0.6)}
            className="bg-transparent"
            renderItem={(hero: Superhero) => (
              <HeroCard
                hero={hero}
                isFav={false}
                onToggle={handleToggle}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default LikedHeroes;
