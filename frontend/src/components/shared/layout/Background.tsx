import BackgroundImageUrl from '@/assets/background.avif';
import BackgroundFallbackUrl from '@/assets/background.webp';
import { useRouterState } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

export default function Background() {
  const isHomepage = useRouterState({ select: (state) => state.location.pathname === '/' });

  return (
    <>
      <div className="fixed -z-50 h-screen w-full overflow-hidden">
        <picture className="block h-full w-full">
          <source srcSet={BackgroundImageUrl} type="image/avif" />
          <img
            src={BackgroundFallbackUrl}
            onLoad={() => document.getElementById('background-placeholder')?.remove()}
            className="h-full w-full object-cover"
            alt=""
          />
        </picture>
      </div>
      <div
        className={cn(
          'fixed -z-50 h-screen w-full transition-[backdrop-filter] duration-150 ease-out',
          isHomepage ? 'backdrop-blur-none' : 'backdrop-blur-md'
        )}
      />
    </>
  );
}
