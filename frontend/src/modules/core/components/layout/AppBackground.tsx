import BackgroundImageUrl from '@assets/background.jpg';
import { useRouterState } from '@tanstack/react-router';
import { motion } from 'motion/react';

export default function AppBackground() {
  const routerState = useRouterState();
  const isHomepage = routerState.location.pathname === '/';

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
        className={'fixed h-screen w-full bg-[image:var(--bg)] bg-no-repeat bg-cover -z-50 bg-center'}
        style={{ '--bg': `url('${BackgroundImageUrl}')` } as React.CSSProperties}
      />
      <motion.div
        className={'fixed h-screen w-full -z-50'}
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
