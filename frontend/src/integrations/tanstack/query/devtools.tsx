import { lazy } from 'react';

import config from '@/config';

export const TanStackQueryDevtools = config.dev
  ? lazy(() => import('@tanstack/react-query-devtools').then((module) => ({ default: module.ReactQueryDevtools })))
  : () => null;
