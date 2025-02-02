import { createRootRouteWithContext, Navigate } from '@tanstack/react-router';

import { RootLayout } from '@/core/pages/RootLayout';
import { UserContextType } from '@/user/contexts/UserContext';

type RouterContext = {
  userContext?: UserContextType;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: () => <Navigate to="/" />,
});
