import type { Decorator } from '@storybook/react-vite';
import { createMemoryHistory, createRootRoute, createRouter, RouterContextProvider } from '@tanstack/react-router';
import { useState } from 'react';

export const withRouter: Decorator = (Story) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

function MemoryRouter({ children }: { children: React.ReactNode }) {
  const [router] = useState(() =>
    createRouter({
      history: createMemoryHistory({ initialEntries: ['/'] }),
      routeTree: createRootRoute(),
    })
  );

  return <RouterContextProvider router={router}>{children}</RouterContextProvider>;
}
