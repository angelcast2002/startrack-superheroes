import type { Superhero } from '../interfaces/hero';
import { memo } from 'react';
import Fist from '../assets/fist/fist.svg?react';
import HeartIcon from '../assets/big-heart/big-heart.svg?react';

type Props = {
  hero: Superhero;
  isFav: boolean;
  onToggle: (isFav: Superhero) => void;
};

const HeroCard = memo(({ hero, isFav, onToggle }: Props) => {
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
      className="
      bg-gradient-to-br from-[#1B1535] via-[#2A2155] to-[#362C6A] relative flex items-center gap-4 p-4 rounded-2xl overflow-hidden backdrop-blur-[27px] backdrop-saturate-150 shadow-xl text-white w-[285px] h-[174px]
    "
    >
      <img src={hero.images?.sm} alt="" aria-hidden className="pointer-events-none absolute inset-0 -z-10 w-full h-full object-cover blur-2xl scale-110 opacity-35" />

      <div className="relative shrink-0 w-[110px]">
        <img className="h-36 w-[110px] object-cover rounded-xl" src={hero.images?.sm} alt={hero.name} />

        <button
          type="button"
          aria-pressed={isFav}
          onClick={() => onToggle(hero)}
          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full grid place-items-center bg-[#6A4DBC] cursor-pointer shadow-md"
        >
          <HeartIcon className={isFav ? 'w-3.5 text-white fill-current' : 'w-3.5 text-white fill-transparent stroke-current stroke-[2.5]'} />
        </button>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center font-poppins">
        <span className="text-lg font-bold truncate">{hero.name}</span>
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
