import { Role } from '@/api/client/user';
import { isInRole, useCurrentUser } from '@/integrations/tanstack/query/auth';

type Props = {
  children: React.ReactNode;

  allowedRoles?: Role[] | Role;
  allowedUserIds?: string[];
};
export function AppGuard({ children, allowedRoles, allowedUserIds }: Props) {
  const currentUser = useCurrentUser();

  if (allowedUserIds && !allowedUserIds.includes(currentUser?.id || '')) {
    return null;
  }

  if (allowedRoles && !isInRole(currentUser, allowedRoles)) {
    return null;
  }
  return children;
}
