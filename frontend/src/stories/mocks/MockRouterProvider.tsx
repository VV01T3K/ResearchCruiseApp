import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router';

type Props = {
  children: React.ReactNode;
};

export function MockRouterProvider({ children }: Props) {
  const rootRoute = createRootRoute();

  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ['/'], initialIndex: 0 }),
    routeTree: rootRoute,
  });

  return <RouterProvider router={router} defaultComponent={() => <>{children}</>} />;
}
