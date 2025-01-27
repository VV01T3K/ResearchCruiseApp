import ImageUrl from '@assets/background.jpg';
import { cn } from '@lib/utils';

export default function AppBackground() {
  return (
    <div
      className={cn('fixed h-full w-full bg-[image:var(--bg)] bg-no-repeat bg-cover -z-50 bg-center')}
      style={{ '--bg': `url('${ImageUrl}')` } as React.CSSProperties}
    />
  );
}
