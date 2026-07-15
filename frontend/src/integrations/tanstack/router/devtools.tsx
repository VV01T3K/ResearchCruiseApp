import { lazy } from 'react';

import config from '@/config';

export const TanStackRouterDevtools = config.dev
  ? lazy(() => import('@tanstack/react-router-devtools').then((module) => ({ default: module.TanStackRouterDevtools })))
  : () => null;
