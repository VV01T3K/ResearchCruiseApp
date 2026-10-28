import { TrashIcon, UserCheckIcon, UserMinusIcon, WarningIcon } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import React from 'react';

import { AppAlert } from '@/components/shared/AppAlert';
import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { Role } from '@/integrations/auth/types';
import type { UserResponse } from '@/api/generated/schemas';
import { useAcceptUser, useDeactivateUser, useDeleteUser } from '@/api/generated/endpoints/users.gen';
import { getProblemDetail } from '@/api/errors';
import { AssignmentsWarning, findActiveAssignments, type UserAssignments } from './AssignmentsWarning';

type Props = {
  selectedUsers: UserResponse[];
  allUsers: UserResponse[];

  allowToRemoveUsers: boolean;

  close: () => void;
};
export function GroupActionsSection({ selectedUsers, allUsers, allowToRemoveUsers, close }: Props) {
  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined);
  const [assignmentWarning, setAssignmentWarning] = React.useState<UserAssignments[] | null>();

  const deleteUserMutation = useDeleteUser({
    mutation: {
      onError: (error) => setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas usuwania użytkownika')),
    },
  });
  const acceptUserMutation = useAcceptUser({
    mutation: {
      onError: (error) => setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas akceptacji użytkownika')),
    },
  });
  const unAcceptUserMutation = useDeactivateUser({
    mutation: {
      onError: (error) =>
        setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas cofania akceptacji użytkownika')),
    },
  });

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

    const promises = selectedUsers.map((user) => deleteUserMutation.mutateAsync({ userId: user.id }));
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

    const promises = usersToAccept.map((user) => acceptUserMutation.mutateAsync({ userId: user.id }));
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

    if (assignmentWarning === undefined) {
      const items = await findActiveAssignments(usersToUnAccept);
      if (items?.length !== 0) {
        setAssignmentWarning(items);
        return;
      }
    }

    const promises = usersToUnAccept.map((user) => unAcceptUserMutation.mutateAsync({ userId: user.id }));
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
          onClick={() => void handleDeleteSelectedUsers()}
        >
          {deletionConfirmed ? (
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <WarningIcon weight="fill" className="h-4 w-4" />
              <span>Na pewno?</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-4">
              <TrashIcon weight="fill" className="h-4 w-4" />
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
          onClick={() => void handleAcceptSelectedUsers()}
        >
          <div className="flex items-center gap-4">
            <UserCheckIcon weight="fill" className="h-4 w-4" />
            <span>Akceptuj zaznaczonych użytkowników</span>
          </div>
        </AppButton>
        {assignmentWarning !== undefined && (
          <div className="mt-4">
            <AssignmentsWarning items={assignmentWarning} action="deactivate" group />
          </div>
        )}
        <AppButton
          variant="danger"
          className="mt-4 w-full"
          disabled={unAcceptUserMutation.isPending || !!submitError}
          onClick={() => void handleUnAcceptSelectedUsers()}
        >
          {assignmentWarning !== undefined ? (
            <div className="flex items-center gap-4">
              <WarningIcon weight="fill" className="h-4 w-4" />
              <span>Usuń akceptację mimo to</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <UserMinusIcon weight="fill" className="h-4 w-4" />
              <span>Usuń akceptację zaznaczonych użytkowników</span>
            </div>
          )}
        </AppButton>
      </div>
    </div>
  );
}
