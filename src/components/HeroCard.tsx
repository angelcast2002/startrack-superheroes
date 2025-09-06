import type { Superhero } from '../interfaces/hero';
import { memo } from 'react';
import logo from '../assets/fist/fist.svg';
import HeartIcon from '../assets/big-heart/big-heart.svg?react';

type Props = {
  hero: Superhero;
  isFav: boolean;
  onToggle: (isFav: boolean) => void;
};

const HeroCard = memo(({ hero, isFav, onToggle }: Props) => {
  const imgUrl = `https://www.superherodb.com/pictures2/portraits/10/100/${hero.id}.jpg`;

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
        "
    >
      <img src={imgUrl} alt="" aria-hidden className="absolute inset-0 -z-10 w-full h-full object-cover blur-2xl scale-110 opacity-35" />

      <div className="relative">
        <img className=" object-cover rounded-xl h-[140px] w-[105px]" src={imgUrl} alt={hero.name} />

        <button
          type="button"
          aria-pressed={isFav}
          onClick={() => onToggle(isFav)}
          className="
            absolute -bottom-2 -right-2 h-12 w-12
            rounded-full grid place-items-center
            bg-[#6A4DBC]
            cursor-pointer
          "
        >
          <HeartIcon className={isFav ? 'w-3.5 text-white fill-current' : 'w-3.5 text-white fill-transparent stroke-current stroke-[2.5]'} />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-extrabold truncate">{hero.name}</h2>

        <div className="mt-2 flex items-center gap-2 text-white/80">
          <img src={logo} alt="Fist Icon" className="h-5 w-5" />
          <span className="font-semibold text-white">8.4</span>
          <span className="text-white/60">/ 10</span>
        </div>
      </div>
    </div>
  );
});

export default HeroCard;
