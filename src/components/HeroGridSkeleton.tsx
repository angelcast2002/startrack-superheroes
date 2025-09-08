import HeroCardSkeleton from './HeroCardSkeleton';

const HeroGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid w-full grid-cols-[repeat(auto-fit,285px)] justify-center gap-4 md:justify-between">
    {Array.from({ length: count }).map((_, i) => (
      <HeroCardSkeleton key={i} />
    ))}
  </div>
);

export default HeroGridSkeleton;
