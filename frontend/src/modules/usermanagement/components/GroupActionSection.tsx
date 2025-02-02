import ExclamationTriangleFillIcon from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?react';
import PersonFillCheckIcon from 'bootstrap-icons/icons/person-fill-check.svg?react';
import PersonFillSlashIcon from 'bootstrap-icons/icons/person-fill-slash.svg?react';
import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';
import { motion } from 'motion/react';
import React from 'react';

import { AppAlert } from '@/core/components/AppAlert';
import { AppButton } from '@/core/components/AppButton';
import { User } from '@/core/models/User';
import {
  useAcceptUserMutation,
  useDeleteUserMutation,
  useUnAcceptUserMutation,
} from '@/usermanagement/hooks/UserManagementApiHooks';

type Props = {
  selectedUsers: User[];

  allowToRemoveUsers: boolean;

  close: () => void;
};
export function GroupActionSection({ selectedUsers, allowToRemoveUsers, close }: Props) {
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

    for (const user of selectedUsers) {
      await deleteUserMutation
        .mutateAsync(user.id, {
          onSuccess: async () => {
            close();
          },
        })
        .catch(() => {});
    }
  }

  async function handleAcceptSelectedUsers() {
    for (const user of selectedUsers.filter((user) => !user.accepted)) {
      await acceptUserMutation
        .mutateAsync(user.id, {
          onSuccess: async () => {
            close();
          },
        })
        .catch(() => {});
    }
  }

  async function handleUnAcceptSelectedUsers() {
    for (const user of selectedUsers.filter((user) => user.accepted)) {
      await unAcceptUserMutation
        .mutateAsync(user.id, {
          onSuccess: async () => {
            close();
          },
        })
        .catch(() => {});
    }
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
            <motion.div className="flex gap-4 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ExclamationTriangleFillIcon className="w-4 h-4" />
              <span>Na pewno?</span>
            </motion.div>
          ) : (
            <div className="flex gap-4 items-center">
              <TrashFillIcon className="w-4 h-4" />
              <span>Usuń zaznaczonych użytkowników</span>
            </div>
          )}
        </AppButton>
      )}

      <div className="mt-4">
        <AppButton
          variant="success"
          className="w-full mt-4"
          disabled={acceptUserMutation.isPending || !!submitError}
          onClick={handleAcceptSelectedUsers}
        >
          <div className="flex gap-4 items-center">
            <PersonFillCheckIcon className="w-4 h-4" />
            <span>Akceptuj zaznaczonych użytkowników</span>
          </div>
        </AppButton>
        <AppButton
          variant="danger"
          className="w-full mt-4"
          disabled={unAcceptUserMutation.isPending || !!submitError}
          onClick={handleUnAcceptSelectedUsers}
        >
          <div className="flex gap-4 items-center">
            <PersonFillSlashIcon className="w-4 h-4" />
            <span>Usuń akceptację zaznaczonych użytkowników</span>
          </div>
        </AppButton>
      </div>
    </div>
  );
}
