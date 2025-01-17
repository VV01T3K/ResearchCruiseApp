import { UserContextType } from '@core/contexts/UserContext';
import { AppHeader } from '@core/components/AppHeader';
import {
  createRootRouteWithContext,
  Navigate,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import AppBackground from '@core/components/AppBackground';

type RouterContext = {
  userContext?: UserContextType;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
  notFoundComponent: () => <Navigate to="/" />,
});

function Root() {
  return (
    <>
      <AppHeader />
      <AppBackground />
      <main className="flex-1">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  );
}
