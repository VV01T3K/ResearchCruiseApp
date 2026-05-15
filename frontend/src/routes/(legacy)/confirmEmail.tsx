import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(legacy)/confirmEmail')({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/confirm-email${location.searchStr}${location.hash ? `#${location.hash}` : ''}`,
      replace: true,
    });
  },
});
