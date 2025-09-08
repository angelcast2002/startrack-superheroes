import ContentLoader from 'react-content-loader';

type Props = { className?: string };

const HeroCardSkeleton = ({ className = '' }: Props) => (
  <div className={`h-[174px] w-[285px] rounded-2xl ${className}`}>
    <ContentLoader
      speed={2}
      width={285}
      height={174}
      viewBox="0 0 285 174"
      backgroundColor="#1F1B37"
      foregroundColor="#2E2754"
      style={{ width: '100%', height: '100%', borderRadius: '16px' }}
    >
      <rect x="12" y="12" rx="12" ry="12" width="110" height="144" />
      <rect x="134" y="24" rx="6" ry="6" width="120" height="16" />
      <rect x="134" y="48" rx="6" ry="6" width="150" height="12" />
      <rect x="134" y="86" rx="6" ry="6" width="90" height="12" />
      <circle cx="110" cy="150" r="16" />
    </ContentLoader>
  </div>
);

export default HeroCardSkeleton;
