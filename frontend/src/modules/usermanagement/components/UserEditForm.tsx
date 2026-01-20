import { useForm } from '@tanstack/react-form';
import EnvelopeFillIcon from 'bootstrap-icons/icons/envelope-fill.svg?react';
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
import { toast } from '@/core/components/layout/toast';
import { getErrors } from '@/core/lib/utils';
import { getRoleLabel, Role } from '@/core/models/Role';
import { User } from '@/core/models/User';
import {
  useAcceptUserMutation,
  useDeleteUserMutation,
  useInitiatePasswordResetMutation,
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
      email: z.email('Niepoprawny adres email').or(z.literal('')),
      firstName: z.string().nonempty('Imię nie może być puste').or(z.literal('')),
      lastName: z.string().nonempty('Nazwisko nie może być puste').or(z.literal('')),
      role: z.enum(Role).or(z.literal('')),
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

  const [passwordResetSent, setPasswordResetSent] = React.useState(false);

  const mutationContext = { editMode, setSubmitError };
  const addNewUserMutation = useNewUserMutation(mutationContext);
  const updateUserMutation = useUpdateUserMutation(mutationContext);
  const deleteUserMutation = useDeleteUserMutation(mutationContext);
  const acceptUserMutation = useAcceptUserMutation(mutationContext);
  const unAcceptUserMutation = useUnAcceptUserMutation(mutationContext);
  const initiatePasswordResetMutation = useInitiatePasswordResetMutation(mutationContext);

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
        const loading = toast.loading('Zapisywanie zmian...');
        try {
          await updateUserMutation.mutateAsync({ userId: user.id, data: value });
          toast.dismiss(loading);
          close();
          toast.success('Zaktualizowano użytkownika');
        } catch (err) {
          toast.dismiss(loading);
          console.error(err);
          toast.error('Nie udało się edytować użytkownika. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
        }
      } else {
        const loading = toast.loading('Dodawanie użytkownika...');
        try {
          await addNewUserMutation.mutateAsync(value);
          toast.dismiss(loading);
          close();
          toast.success('Utworzono nowego użytkownika');
        } catch (err) {
          toast.dismiss(loading);
          console.error(err);
          toast.error('Nie udało się dodać użytkownika. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
        }
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
    const loading = toast.loading('Usuwanie użytkownika...');
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast.dismiss(loading);
      close();
      toast.success('Użytkownik został usunięty');
    } catch (err) {
      toast.dismiss(loading);
      console.error(err);
      toast.error('Nie udało się usunąć użytkownika');
    }
  }

  async function handleAccountAcceptanceToggle() {
    if (!editMode) {
      throw new Error('This method should be called only for existing users');
    }

    if (!user.accepted) {
      const loading = toast.loading('Akceptowanie konta użytkownika...');
      try {
        await acceptUserMutation.mutateAsync(user.id);
        toast.dismiss(loading);
        close();
        toast.success('Zaakceptowano konto użytkownika');
      } catch (err) {
        toast.dismiss(loading);
        console.error(err);
        toast.error('Nie udało się zaakceptować konta użytkownika');
      }
    } else {
      const loading = toast.loading('Cofanie akceptacji konta użytkownika...');
      try {
        await unAcceptUserMutation.mutateAsync(user.id);
        toast.dismiss(loading);
        close();
        toast.success('Cofnięto akceptację konta użytkownika');
      } catch (err) {
        toast.dismiss(loading);
        console.error(err);
        toast.error('Nie udało się cofnąć akceptacji konta użytkownika');
      }
    }
  }

  async function handleInitiatePasswordReset() {
    if (!editMode) {
      throw new Error('This method should be called only for existing users');
    }

    await initiatePasswordResetMutation
      .mutateAsync(user.email, {
        onSuccess: () => {
          setPasswordResetSent(true);
        },
      })
      .catch(() => {});
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex h-14 justify-around">
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
          <div className="grid max-w-48 grid-cols-2 gap-1">
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
              errors={getErrors(field.state.meta)}
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
              errors={getErrors(field.state.meta)}
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
              errors={getErrors(field.state.meta)}
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
              errors={getErrors(field.state.meta)}
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
                  <div className="flex items-center gap-4">
                    <FloppyFillIcon className="h-4 w-4" />
                    <span>Zapisz</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <PersonAddIcon className="h-4 w-4" />
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
                    <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ExclamationTriangleFill className="h-4 w-4" />
                      <span>Czy na pewno?</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <TrashFillIcon className="h-4 w-4" />
                      <span>Usuń</span>
                    </div>
                  )}
                </AppButton>
              )}

              {editMode && (
                <AppButton
                  variant={!user.accepted ? 'success' : 'danger'}
                  disabled={!!submitError || acceptUserMutation.isPending || unAcceptUserMutation.isPending}
                  onClick={() => handleAccountAcceptanceToggle()}
                  className="w-full"
                >
                  {!user.accepted ? (
                    <div className="flex items-center gap-4">
                      <PersonFillCheckIcon className="h-4 w-4" />
                      <span>Zaakceptuj konto użytkownika</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <PersonFillSlashIcon className="h-4 w-4" />
                      <span>Cofnij akceptację konta</span>
                    </div>
                  )}
                </AppButton>
              )}

              {editMode && (
                <AppButton
                  variant={passwordResetSent ? 'success' : 'primaryOutline'}
                  disabled={!!submitError || initiatePasswordResetMutation.isPending || passwordResetSent}
                  onClick={() => handleInitiatePasswordReset()}
                  className="w-full"
                >
                  {passwordResetSent ? (
                    <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <EnvelopeFillIcon className="h-4 w-4" />
                      <span>Link do zmiany hasła wysłany</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <EnvelopeFillIcon className="h-4 w-4" />
                      <span>Wyślij link do zmiany hasła</span>
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
