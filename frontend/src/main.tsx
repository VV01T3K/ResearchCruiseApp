import './styles/index.css';

import { IconContext } from '@phosphor-icons/react';
import { reactErrorHandler } from '@sentry/react';
import { MotionConfig, MotionGlobalConfig } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

import { FatalErrorBoundary } from '@/components/shared/FatalErrorBoundary';
import config from '@/config';
import { iconDefaults } from '@/integrations/phosphor/iconDefaults';
import { initializeSentry } from '@/integrations/sentry/client';
import { TanStackQueryProvider } from '@/integrations/tanstack/query/root-provider';
import { RouterView, router } from '@/router';

z.config(z.locales.pl());
initializeSentry(router);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
MotionGlobalConfig.instantAnimations = reducedMotion.matches;
reducedMotion.addEventListener('change', (event) => (MotionGlobalConfig.instantAnimations = event.matches));

const sentryErrorHandlers = config.sentryDsn
  ? {
      onUncaughtError: reactErrorHandler(),
      onCaughtError: reactErrorHandler(),
      onRecoverableError: reactErrorHandler(),
    }
  : undefined;

createRoot(document.getElementById('root')!, sentryErrorHandlers).render(
  <StrictMode>
    <FatalErrorBoundary>
      <IconContext.Provider value={iconDefaults}>
        <TanStackQueryProvider>
          <MotionConfig transition={{ duration: 0.2, ease: 'easeOut' }}>
            <RouterView />
          </MotionConfig>
        </TanStackQueryProvider>
      </IconContext.Provider>
    </FatalErrorBoundary>
  </StrictMode>
);
