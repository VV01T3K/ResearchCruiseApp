import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(legacy)/resetPassword')({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/reset-password${location.searchStr}${location.hash ? `#${location.hash}` : ''}`,
      replace: true,
    });
  },
});
