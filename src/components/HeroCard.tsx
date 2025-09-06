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
    const stats = ((hero.powerstats?.intelligence ?? 0) + (hero.powerstats?.strength ?? 0) + (hero.powerstats?.speed ?? 0) + (hero.powerstats?.durability ?? 0) + (hero.powerstats?.power ?? 0) + (hero.powerstats?.combat ?? 0)) / 6 / 10;
    return stats.toFixed(1);
  };

  return (
    <div
      className="
        bg-gradient-to-br from-[#1B1535] via-[#2A2155] to-[#362C6A]
        relative flex gap-4 p-4
        rounded-2xl overflow-hidden
        border border-[rgba(106,77,188,1)]
        backdrop-blur-[27px] backdrop-saturate-150
        shadow-xl text-white
        w-full max-w-md
        h-[174px]
        sm:h-[174px] sm:flex-row
        flex-col sm:flex-row
        items-center sm:items-stretch
        md:max-w-lg
        md:h-[190px]
        lg:max-w-xl
        lg:h-[210px]
      "
    >
      <img
        src={hero.images?.sm}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 w-full h-full object-cover blur-2xl scale-110 opacity-35"
      />

      <div className="relative flex-shrink-0 flex justify-center items-center w-full sm:w-auto">
        <img
          className="object-cover rounded-xl h-[120px] w-[90px] sm:h-[140px] sm:w-[105px] md:h-[150px] md:w-[115px] lg:h-[170px] lg:w-[130px]"
          src={hero.images?.sm}
          alt={hero.name}
        />

        <button
          type="button"
          aria-pressed={isFav}
          onClick={() => onToggle(hero)}
          className="
            absolute -bottom-2 -right-2 h-10 w-10 sm:h-12 sm:w-12
            rounded-full grid place-items-center
            bg-[#6A4DBC]
            cursor-pointer
          "
        >
          <HeartIcon className={isFav ? 'w-3.5 text-white fill-current' : 'w-3.5 text-white fill-transparent stroke-current stroke-[2.5]'} />
        </button>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center sm:justify-start">
        <span className="text-lg sm:text-xl font-bold truncate font-poppins text-white">{hero.name}</span>
        <span className="text-xs sm:text-sm text-white/49 font-normal">Real Name: {hero.biography?.fullName}</span>
        <div className="mt-2 flex items-center gap-2">
          <Fist className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          <span className="text-xs sm:text-sm font-semibold text-white">{getPowerStats()}</span>
          <span className="text-xs sm:text-sm text-white/49 font-normal">/ 10</span>
        </div>
      </div>
    </div>
  );
});

export default HeroCard;
