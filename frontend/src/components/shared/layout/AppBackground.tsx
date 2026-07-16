import BackgroundImageUrl from '@/assets/background.avif';
import BackgroundPlaceholderUrl from '@/assets/background-placeholder.jpg';
import BackgroundFallbackUrl from '@/assets/background.webp';
import { useRouterState } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function AppBackground() {
  const routerState = useRouterState();
  const isHomepage = routerState.location.pathname === '/';
  const [isLoaded, setIsLoaded] = useState(false);

  const variants = {
    transparent: {
      '--blur': '0px',
    },
    blur: {
      '--blur': '12px',
    },
  };

  return (
    <>
      <div
        className="fixed -z-50 h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${BackgroundPlaceholderUrl}')` }}
      >
        <picture className={`block h-full w-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <source srcSet={BackgroundImageUrl} type="image/avif" />
          <img
            src={BackgroundFallbackUrl}
            onLoad={() => setIsLoaded(true)}
            className="h-full w-full object-cover"
            alt=""
          />
        </picture>
      </div>
      <motion.div
        className={'fixed -z-50 h-screen w-full'}
        variants={variants}
        initial="transparent"
        animate={isHomepage ? 'transparent' : 'blur'}
        exit={!isHomepage ? 'transparent' : 'blur'}
        transition={{ duration: 0.3 }}
        style={{ backdropFilter: 'blur(var(--blur))' } as React.CSSProperties}
      />
    </>
  );
}
