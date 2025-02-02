import BackgroundImageUrl from '@assets/background.jpg';

import { cn } from '@/core/lib/utils';

export default function AppBackground() {
  return (
    <div
      className={cn('fixed h-full w-full bg-[image:var(--bg)] bg-no-repeat bg-cover -z-50 bg-center')}
      style={{ '--bg': `url('${BackgroundImageUrl}')` } as React.CSSProperties}
    />
  );
}
