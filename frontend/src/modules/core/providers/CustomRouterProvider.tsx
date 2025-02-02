import { routeTree } from '@routeTree';
import { createBrowserHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import React from 'react';

import { useUserContext } from '@/user/hooks/UserContextHook';

const router = createRouter({
  routeTree,
  context: {
    userContext: undefined,
  },
  history: createBrowserHistory(),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function CustomRouterProvider() {
  const userContext = useUserContext();

  React.useEffect(() => {
    router.invalidate();
  }, [userContext]);

  return <RouterProvider router={router} context={{ userContext }} />;
}
