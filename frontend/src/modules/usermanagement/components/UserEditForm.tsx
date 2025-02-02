import { useForm } from '@tanstack/react-form';
import ExclamationTriangleFill from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import PersonFillCheckIcon from 'bootstrap-icons/icons/person-fill-check.svg?react';
import PersonFillSlashIcon from 'bootstrap-icons/icons/person-fill-slash.svg?react';
import PersonAddIcon from 'bootstrap-icons/icons/person-plus.svg?react';
import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { z } from 'zod';

import { AppAlert } from '@/core/components/AppAlert';
import { AppAvatar } from '@/core/components/AppAvatar';
import { AppBadge } from '@/core/components/AppBadge';
import { AppButton } from '@/core/components/AppButton';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { mapValidationErrors } from '@/core/lib/utils';
import { getRoleLabel, Role } from '@/core/models/Role';
import { User } from '@/core/models/User';
import {
  useAcceptUserMutation,
  useDeleteUserMutation,
  useNewUserMutation,
  useUnAcceptUserMutation,
  useUpdateUserMutation,
} from '@/usermanagement/hooks/UserManagementApiHooks';

type Props = {
  user?: User;
  allUsers: User[];

  allowedRoles: Role[];
  allowToRemoveUsers: boolean;

  close: () => void;
};
export function UserEditForm({ user, allUsers, allowedRoles, allowToRemoveUsers, close }: Props) {
  const editMode = !!user;
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined);
  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);

  const validationSchema = z
    .object({
      email: z.string().email('Niepoprawny adres email').or(z.literal('')),
      firstName: z.string().nonempty('Imię nie może być puste').or(z.literal('')),
      lastName: z.string().nonempty('Nazwisko nie może być puste').or(z.literal('')),
      role: z.nativeEnum(Role).or(z.literal('')),
    })
    .superRefine(({ email }, ctx) => {
      if (!editMode && allUsers.some((user) => user.email === email)) {
        return ctx.addIssue({
          code: 'custom',
          message: 'Użytkownik o podanym adresie e-mail już istnieje',
          path: ['email'],
        });
      }
    })
    .superRefine(({ role }, ctx) => {
      if (!allowedRoles.some((allowedRole) => allowedRole === role)) {
        return ctx.addIssue({
          code: 'custom',
          message: 'Nie masz uprawnień do nadania wybranej roli',
          path: ['roles'],
        });
      }
    });

  const mutationContext = { editMode, setSubmitError };
  const addNewUserMutation = useNewUserMutation(mutationContext);
  const updateUserMutation = useUpdateUserMutation(mutationContext);
  const deleteUserMutation = useDeleteUserMutation(mutationContext);
  const acceptUserMutation = useAcceptUserMutation(mutationContext);
  const unAcceptUserMutation = useUnAcceptUserMutation(mutationContext);

  const form = useForm({
    defaultValues: {
      email: user?.email ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      role: user?.roles[0] ?? '',
    },
    validators: {
      onChange: validationSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.email || !value.firstName || !value.lastName || !value.role) {
        throw new Error('Not all fields are filled despite validation');
      }

      if (editMode) {
        await updateUserMutation
          .mutateAsync(
            { userId: user.id, data: value },
            {
              onSuccess: async () => {
                close();
              },
            }
          )
          .catch(() => {});
      } else {
        await addNewUserMutation
          .mutateAsync(value, {
            onSuccess: async () => {
              close();
            },
          })
          .catch(() => {});
      }
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  async function handleUserDeletion() {
    if (!editMode) {
      throw new Error('This method should be called only for existing users');
    }

    if (!deletionConfirmed) {
      setDeletionConfirmed(true);
      return;
    }

    await deleteUserMutation
      .mutateAsync(user.id, {
        onSuccess: async () => {
          close();
        },
      })
      .catch(() => {});
  }

  async function handleAccountAcceptanceToggle() {
    if (!editMode) {
      throw new Error('This method should be called only for existing users');
    }

    if (!user.accepted) {
      await acceptUserMutation
        .mutateAsync(user.id, {
          onSuccess: () => {
            user.accepted = true;
          },
        })
        .catch(() => {});
    } else {
      await unAcceptUserMutation
        .mutateAsync(user.id, {
          onSuccess: () => {
            user.accepted = false;
          },
        })
        .catch(() => {});
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-around h-14">
        <form.Subscribe
          selector={(state) => [state.values.firstName, state.values.lastName]}
          children={([firstName, lastName]) => (
            <AnimatePresence>
              {(firstName || lastName) && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <AppAvatar fullName={`${firstName} ${lastName}`} />
                </motion.span>
              )}
            </AnimatePresence>
          )}
        />

        {editMode && (
          <div className="grid grid-cols-2 gap-1 max-w-48">
            <span>Stan Emaila:</span>
            <span className="flex">
              <AppBadge variant={user.emailConfirmed ? 'success' : 'danger'}>
                {user.emailConfirmed ? 'Zweryfikowany' : 'Niezweryfikowany'}
              </AppBadge>
            </span>
            <span>Stan Konta:</span>
            <span className="flex">
              <AppBadge variant={user.accepted ? 'success' : 'danger'}>
                {user.accepted ? 'Zaakceptowane' : 'Niezaakceptowane'}
              </AppBadge>
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <form.Field
          name="firstName"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              label="Imię"
              placeholder="Jan"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={field.state.meta.errors.map((x) => x!.toString())}
              required
            />
          )}
        />

        <form.Field
          name="lastName"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              label="Nazwisko"
              placeholder="Kowalski"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={field.state.meta.errors.map((x) => x!.toString())}
              required
            />
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              label="Email"
              placeholder="jan.kowalski@example.com"
              type="email"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={field.state.meta.errors.map((x) => x!.toString())}
              required
            />
          )}
        />

        <form.Field
          name="role"
          children={(field) => (
            <AppDropdownInput
              name={field.name}
              value={field.state.value as string}
              allOptions={Object.values(allowedRoles).map((role) => ({
                value: role,
                inlineLabel: getRoleLabel(role),
              }))}
              label="Rola"
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              errors={mapValidationErrors(field.state.meta.errors)}
              required
            />
          )}
        />
      </div>

      <div className="mt-8 space-y-4">
        {submitError && (
          <AppAlert variant="danger" onClose={() => setSubmitError(undefined)}>
            {submitError}
          </AppAlert>
        )}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <AppButton type="submit" className="w-full" disabled={!canSubmit || isSubmitting || !!submitError}>
                {editMode ? (
                  <div className="flex gap-4 items-center">
                    <FloppyFillIcon className="w-4 h-4" />
                    <span>Zapisz</span>
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    <PersonAddIcon className="w-4 h-4" />
                    <span>Dodaj</span>
                  </div>
                )}
              </AppButton>

              {editMode && allowToRemoveUsers && (
                <AppButton
                  variant={deletionConfirmed ? 'danger' : 'warning'}
                  disabled={!canSubmit || isSubmitting}
                  onClick={handleUserDeletion}
                  className="w-full"
                >
                  {deletionConfirmed ? (
                    <motion.div className="flex gap-4 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ExclamationTriangleFill className="w-4 h-4" />
                      <span>Czy na pewno?</span>
                    </motion.div>
                  ) : (
                    <div className="flex gap-4 items-center">
                      <TrashFillIcon className="w-4 h-4" />
                      <span>Usuń</span>
                    </div>
                  )}
                </AppButton>
              )}

              {editMode && (
                <AppButton
                  variant={!user.accepted ? 'success' : 'danger'}
                  disabled={!!submitError}
                  onClick={() => handleAccountAcceptanceToggle()}
                  className="w-full"
                >
                  {!user.accepted ? (
                    <div className="flex gap-4 items-center">
                      <PersonFillCheckIcon className="w-4 h-4" />
                      <span>Zaakceptuj konto użytkownika</span>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-center">
                      <PersonFillSlashIcon className="w-4 h-4" />
                      <span>Cofnij akceptację konta</span>
                    </div>
                  )}
                </AppButton>
              )}
            </>
          )}
        />
      </div>
    </form>
  );
}
