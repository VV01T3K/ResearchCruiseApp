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

  //@ts-expect-error The Custom router provider declares an expected type of Router, but here we don't want to use it
  return <RouterProvider router={router} defaultComponent={() => <>{children}</>} />;
}
