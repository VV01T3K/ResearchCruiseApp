import { Role, User } from '@core/models';
import { useForm } from '@tanstack/react-form';
import { AppInput } from 'src/features/form/compontents/AppInput';
import { AppSelectInput } from 'src/features/form/compontents/AppSelectInput';
import { z } from 'zod';
import { getRoleName, UserDto } from '../helpers';
import { AppAlert, AppBadge, AppButton, AppInitialsAvatar } from '@core/components';
import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import ExclamationTriangleFill from 'bootstrap-icons/icons/exclamation-triangle-fill.svg?react';
import TrashFillIcon from 'bootstrap-icons/icons/trash-fill.svg?react';
import FloppyFillIcon from 'bootstrap-icons/icons/floppy-fill.svg?react';
import PersonAddIcon from 'bootstrap-icons/icons/person-plus.svg?react';
import PersonFillCheckIcon from 'bootstrap-icons/icons/person-fill-check.svg?react';
import PersonFillSlashIcon from 'bootstrap-icons/icons/person-fill-slash.svg?react';
import {
  useNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAcceptUserMutation,
  useUnAcceptUserMutation,
} from '../hooks/UserManagementHooks';

type Props = {
  user?: User;
  users: User[];
  allowedRoles: Role[];
  canRemoveUsers: boolean;
  close: () => void;
};

export function EditUserForm({ user, users, allowedRoles, canRemoveUsers, close }: Props) {
  const isEditingExistingUser = !!user;
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined);
  const [userDeleteConfirmation, setUserDeleteConfirmation] = React.useState<boolean>(false);

  const newUserFormSchema = z
    .object({
      email: z.string().email('Niepoprawny adres e-mail').or(z.literal('')),
      firstName: z.string().min(1).or(z.literal('')),
      lastName: z.string().min(1).or(z.literal('')),
      role: z.enum([Role.Administrator, Role.CruiseManager, Role.Guest, Role.ShipOwner]).or(z.literal('')),
    })
    .superRefine(({ email }, ctx) => {
      if (!isEditingExistingUser && users.some((user) => user.email === email)) {
        return ctx.addIssue({
          code: 'custom',
          message: 'Użytkownik o podanym adresie e-mail już istnieje',
          path: ['email'],
        });
      }
    });

  const roles = Object.values(allowedRoles).map((role) => ({ label: getRoleName(role), value: role }));
  const mutationContext = {
    isEditingExistingUser,
    setSubmitError,
  };

  const addNewUserMutation = useNewUserMutation(mutationContext);
  const updateUserMutation = useUpdateUserMutation(mutationContext);
  const deleteUserMutation = useDeleteUserMutation(mutationContext);
  const acceptUserMutation = useAcceptUserMutation(mutationContext);
  const unAcceptUserMutation = useUnAcceptUserMutation(mutationContext);

  const form = useForm({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      role: user?.roles[0] || '',
    } as UserDto,
    validators: {
      onChange: newUserFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.email || !value.firstName || !value.lastName || !value.role) {
        throw new Error('Not all fields are filled despite validation');
      }

      if (isEditingExistingUser) {
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

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    evt.stopPropagation();
    form.handleSubmit();
  }

  async function handleUserDelete() {
    if (!isEditingExistingUser) {
      throw new Error('This method should be called only for existing users');
    }

    if (!userDeleteConfirmation) {
      setUserDeleteConfirmation(true);
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
    if (!isEditingExistingUser) {
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
                  <AppInitialsAvatar fullName={[firstName, lastName].join(' ')} />
                </motion.span>
              )}
            </AnimatePresence>
          )}
        />
        {isEditingExistingUser && (
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
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
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
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
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
              onBlur={field.handleBlur}
              type="email"
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
              required
            />
          )}
        />

        <form.Field
          name="role"
          children={(field) => (
            <AppSelectInput
              name={field.name}
              value={field.state.value}
              possibleValues={roles}
              promptForSelection
              label="Rola"
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.errors.join(', ')}
              required
            />
          )}
        />
      </div>
      <div className="mt-8 space-y-4">
        {submitError && (
          <div>
            <AppAlert variant="danger" onClose={() => setSubmitError(undefined)}>
              {submitError}
            </AppAlert>
          </div>
        )}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <AppButton type="submit" className="w-full" disabled={!canSubmit || isSubmitting || !!submitError}>
                {isEditingExistingUser ? (
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
              {isEditingExistingUser && canRemoveUsers && (
                <>
                  <AppButton
                    type="button"
                    variant={userDeleteConfirmation ? 'dangerOutline' : 'danger'}
                    className="w-full"
                    disabled={!canSubmit || isSubmitting}
                    onClick={() => handleUserDelete()}
                  >
                    {userDeleteConfirmation ? (
                      <motion.div className="flex gap-4 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <ExclamationTriangleFill className="w-4 h-4" />
                        <span>Na pewno?</span>
                      </motion.div>
                    ) : (
                      <div className="flex gap-4 items-center">
                        <TrashFillIcon className="w-4 h-4" />
                        <span>Usuń</span>
                      </div>
                    )}
                  </AppButton>
                </>
              )}
              {isEditingExistingUser && (
                <AppButton
                  type="button"
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
