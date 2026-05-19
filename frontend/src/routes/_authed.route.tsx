import { createFileRoute, Outlet } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';

export const Route = createFileRoute('/_authed')({
  component: Outlet,
  beforeLoad: allowOnly.authenticated(),
});
