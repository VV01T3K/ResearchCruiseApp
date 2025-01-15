import { UserContextType } from '@contexts/UserContext';
import AppBackground from '@core/components/AppBackground';
import { AppHeader } from '@core/components/AppHeader';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

type RouterContext = {
  userContext?: UserContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <AppBackground />
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  );
}
