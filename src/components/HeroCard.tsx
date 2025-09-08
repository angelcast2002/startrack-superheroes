import type { Superhero } from '../interfaces/hero';
import { memo } from 'react';
import Fist from '../assets/fist/fist.svg?react';
import HeartIcon from '../assets/big-heart/big-heart.svg?react';

type Props = {
  hero: Superhero;
  isFav: boolean;
  recent?: boolean;
  onToggle: (hero: Superhero) => void;
};

const HeroCard = memo(({ hero, isFav, recent = false, onToggle }: Props) => {
  const getPowerStats = () => {
    const stats =
      ((hero.powerstats?.intelligence ?? 0) +
        (hero.powerstats?.strength ?? 0) +
        (hero.powerstats?.speed ?? 0) +
        (hero.powerstats?.durability ?? 0) +
        (hero.powerstats?.power ?? 0) +
        (hero.powerstats?.combat ?? 0)) /
      6 /
      10;
    return stats.toFixed(1);
  };

  return (
    <div
      className="relative flex h-[174px] w-[285px] items-center gap-4 overflow-hidden rounded-2xl
                    bg-gradient-to-br from-[#1B1535] via-[#2A2155] to-[#362C6A]
                    p-4 text-white shadow-xl backdrop-blur-[27px] backdrop-saturate-150 animate-fade-in-up motion-reduce:animate-none "
    >
      <img src={hero.images?.sm} alt="" aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full scale-110 object-cover opacity-35 blur-2xl" />

      <span
        className="pointer-events-none absolute -right-2 top-2 rounded-full bg-[#6A4DBC] px-3 py-1 text-xs font-semibold"
        style={{ opacity: recent ? 1 : 0, transform: recent ? 'translateY(0)' : 'translateY(-6px)', transition: 'opacity .3s ease, transform .3s ease' }}
      >
        Liked recently
      </span>

      <div className="relative w-[110px] shrink-0">
        <img className="h-36 w-[110px] rounded-xl object-cover" src={hero.images?.sm} alt={hero.name} />
        <button
          type="button"
          aria-pressed={isFav}
          onClick={() => onToggle(hero)}
          className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[#6A4DBC] shadow-md"
        >
          <HeartIcon className={isFav ? 'w-3.5 text-white fill-current' : 'w-3.5 text-white fill-transparent stroke-current stroke-[2.5]'} />
        </button>
      </div>

      <div className="min-w-0 flex flex-1 flex-col justify-center gap-1 font-poppins">
        <span className="truncate text-lg font-bold">{hero.name}</span>
        <span className="text-xs text-white/50">Real Name: {hero.biography?.fullName}</span>
        <div className="mt-2 flex items-center gap-2">
          <Fist className="h-3 w-3" />
          <span className="text-xs font-semibold text-white">{getPowerStats()}</span>
          <span className="text-xs text-white/50">/ 10</span>
        </div>
      </div>
    </div>
  );
});

export default HeroCard;
