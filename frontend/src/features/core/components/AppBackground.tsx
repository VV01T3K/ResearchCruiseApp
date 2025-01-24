import { cn } from '@lib/utils';
import ImageUrl from '@assets/background.jpg';

export default function AppBackground() {
  return (
    <div
      className={cn('absolute h-full w-full bg-[image:var(--bg)] bg-no-repeat bg-cover -z-50 bg-center')}
      style={{ '--bg': `url('${ImageUrl}')` } as React.CSSProperties}
    />
  );
}
