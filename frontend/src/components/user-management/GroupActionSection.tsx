import ExclamationTriangleFillIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?react';
import PersonFillCheckIcon from 'bootstrap-icons/icons/person-fill-check.svg?react';
import PersonFillSlashIcon from 'bootstrap-icons/icons/person-fill-slash.svg?react';
import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';
import { motion } from 'motion/react';
import React from 'react';

import { AppAlert } from '@/components/shared/AppAlert';
import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { Role } from '@/models/shared/Role';
import { User } from '@/models/shared/User';
import {
  useAcceptUserMutation,
  useDeleteUserMutation,
  useUnAcceptUserMutation,
} from '@/api/hooks/user-management/UserManagementApiHooks';

type Props = {
  selectedUsers: User[];
  allUsers: User[];

  allowToRemoveUsers: boolean;

  close: () => void;
};
export function GroupActionSection({ selectedUsers, allUsers, allowToRemoveUsers, close }: Props) {
  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined);

  const mutationContext = { editMode: true, setSubmitError };
  const deleteUserMutation = useDeleteUserMutation(mutationContext);
  const acceptUserMutation = useAcceptUserMutation(mutationContext);
  const unAcceptUserMutation = useUnAcceptUserMutation(mutationContext);

  async function handleDeleteSelectedUsers() {
    if (!deletionConfirmed) {
      setDeletionConfirmed(true);
      return;
    }

    if (selectedUsers.length === 0) return;

    if (selectedUsers.some((user) => user.roles.includes(Role.Administrator))) {
      const selectedIds = new Set(selectedUsers.map((u) => u.id));
      const remainingAdmins = allUsers.filter((u) => !selectedIds.has(u.id) && u.roles.includes(Role.Administrator));
      if (remainingAdmins.length === 0) {
        toast.error('Po usunięciu zaznaczonych użytkowników musi istnieć co najmniej jeden admin');
        setDeletionConfirmed(false);
        return;
      }
    }

    const promises = selectedUsers.map((user) => deleteUserMutation.mutateAsync(user.id));
    const results = await Promise.allSettled(promises);
    const failedCount = results.filter((result) => result.status === 'rejected').length;

    if (failedCount === 0) {
      toast.success('Pomyślnie usunięto wszystkich wybranych użytkowników');
    } else if (failedCount === selectedUsers.length) {
      toast.error('Nie udało się usunąć żadnego z użytkowników');
    } else {
      toast.error(`Usunięto część osób. Błąd przy ${failedCount} użytkownikach`);
    }
    close();
  }

  async function handleAcceptSelectedUsers() {
    const usersToAccept = selectedUsers.filter((user) => !user.accepted);
    if (usersToAccept.length === 0) {
      toast.success('Wszyscy zaznaczeni użytkownicy są już zaakceptowani');
      return;
    }

    const promises = usersToAccept.map((user) => acceptUserMutation.mutateAsync(user.id));
    const results = await Promise.allSettled(promises);
    const failedCount = results.filter((result) => result.status === 'rejected').length;

    if (failedCount === 0) {
      toast.success('Pomyślnie zaakceptowano wszystkich wybranych użytkowników');
    } else {
      toast.error(`Nie udało się zaakceptować ${failedCount} użytkowników`);
    }
    close();
  }

  async function handleUnAcceptSelectedUsers() {
    const usersToUnAccept = selectedUsers.filter((user) => user.accepted);
    if (usersToUnAccept.length === 0) {
      toast.success('Wszyscy zaznaczeni użytkownicy są już niezaakceptowani');
      return;
    }

    const promises = usersToUnAccept.map((user) => unAcceptUserMutation.mutateAsync(user.id));
    const results = await Promise.allSettled(promises);
    const failedCount = results.filter((result) => result.status === 'rejected').length;

    if (failedCount === 0) {
      toast.success('Pomyślnie usunięto akceptację wszystkich wybranych użytkowników');
    } else {
      toast.error(`Nie udało się usunąć akceptacji ${failedCount} użytkowników`);
    }
    close();
  }

  return (
    <div>
      {submitError && (
        <div>
          <AppAlert variant="danger" onClose={() => setSubmitError(undefined)}>
            {submitError}
          </AppAlert>
        </div>
      )}

      {allowToRemoveUsers && (
        <AppButton
          type="button"
          variant={deletionConfirmed ? 'dangerOutline' : 'danger'}
          className="w-full"
          disabled={deleteUserMutation.isPending || !!submitError}
          onClick={() => handleDeleteSelectedUsers()}
        >
          {deletionConfirmed ? (
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ExclamationTriangleFillIcon className="h-4 w-4" />
              <span>Na pewno?</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4">
              <TrashFillIcon className="h-4 w-4" />
              <span>Usuń zaznaczonych użytkowników</span>
            </div>
          )}
        </AppButton>
      )}

      <div className="mt-4">
        <AppButton
          variant="success"
          className="mt-4 w-full"
          disabled={acceptUserMutation.isPending || !!submitError}
          onClick={handleAcceptSelectedUsers}
        >
          <div className="flex items-center gap-4">
            <PersonFillCheckIcon className="h-4 w-4" />
            <span>Akceptuj zaznaczonych użytkowników</span>
          </div>
        </AppButton>
        <AppButton
          variant="danger"
          className="mt-4 w-full"
          disabled={unAcceptUserMutation.isPending || !!submitError}
          onClick={handleUnAcceptSelectedUsers}
        >
          <div className="flex items-center gap-4">
            <PersonFillSlashIcon className="h-4 w-4" />
            <span>Usuń akceptację zaznaczonych użytkowników</span>
          </div>
        </AppButton>
      </div>
    </div>
  );
}
