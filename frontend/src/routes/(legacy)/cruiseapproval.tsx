import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(legacy)/cruiseapproval')({
  beforeLoad: ({ location }) => {
    throw redirect({
      href: `/cruise-approval${location.searchStr}${location.hash ? `#${location.hash}` : ''}`,
      replace: true,
    });
  },
});
