import { UserContext } from '@core/contexts/UserContext';
import { cn } from '@lib/utils';
import { useContext } from 'react';
import ImageUrl from '@assets/background.jpg';

export default function AppBackground() {
  const userContext = useContext(UserContext);

  return (
    <div
      className={cn(
        'absolute h-full w-full bg-[image:var(--bg)] -z-50 bg-center',
        userContext?.currentUser ? 'opacity-50' : ''
      )}
      style={{ '--bg': `url('${ImageUrl}')` } as React.CSSProperties}
    />
  );
}
