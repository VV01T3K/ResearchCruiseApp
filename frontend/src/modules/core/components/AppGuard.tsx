import { Role } from '@/core/models/Role';
import { useUserContext } from '@/user/hooks/UserContextHook';

type Props = {
  children: React.ReactNode;

  allowedRoles?: Role[] | Role;
  allowedUserIds?: string[];
};
export function AppGuard({ children, allowedRoles, allowedUserIds }: Props) {
  const { currentUser, isInRole } = useUserContext();

  if (allowedUserIds && !allowedUserIds.includes(currentUser?.id || '')) {
    return null;
  }

  if (allowedRoles && !isInRole(allowedRoles)) {
    return null;
  }
  return children;
}
