import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from '@tanstack/react-router';
import { useState } from 'react';

export function StoryRouterProvider({ children }: { children: React.ReactNode }) {
  const [router] = useState(() =>
    createRouter({
      history: createMemoryHistory({ initialEntries: ['/'] }),
      routeTree: createRootRoute(),
    })
  );

  return <RouterContextProvider router={router}>{children}</RouterContextProvider>;
}
