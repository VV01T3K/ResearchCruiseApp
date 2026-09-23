import { CreateUserRequest, UpdateUserRequest } from '@/api/generated/schemas';
import { formContract } from '@/integrations/tanstack/form/schema';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { formValidationLogic } from '@/integrations/tanstack/form/validation';
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

import { AppAlert } from '@/components/shared/AppAlert';
import { AppAvatar } from '@/components/shared/AppAvatar';
import { AppBadge } from '@/components/shared/AppBadge';
import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { getRoleLabel, Role } from '@/integrations/auth/types';
import type { UserResponse } from '@/api/generated/schemas';

import {
  useAcceptUser,
  useAddUserRole,
  useCreateUser,
  useDeactivateUser,
  useDeleteUser,
  useRemoveUserRole,
  useUpdateUser,
} from '@/api/generated/endpoints/users.gen';
import { useRequestPasswordReset } from '@/api/generated/endpoints/auth.gen';
import { getProblemDetail } from '@/api/fetch';

type Props = {
  user?: UserResponse;
  allUsers: UserResponse[];

  allowedRoles: Role[];
  allowToRemoveUsers: boolean;

  close: () => void;
};
export function EditForm({ user, allUsers, allowedRoles, allowToRemoveUsers, close }: Props) {
  const editMode = !!user;
  const [submitError, setSubmitError] = React.useState<string | undefined>(undefined);
  const [deletionConfirmed, setDeletionConfirmed] = React.useState(false);

  const validationSchema = z
    .object({
      email: z.email('Niepoprawny adres email'),
      firstName: z.string().nonempty('Imię nie może być puste'),
      lastName: z.string().nonempty('Nazwisko nie może być puste'),
      role: z.enum(Role, { error: 'Rola nie może być pusta' }),
    })
    .superRefine(({ email }, ctx) => {
      if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase() && (!editMode || u.id !== user?.id))) {
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
          path: ['role'],
        });
      }
    })
    .transform(({ role, ...user }): z.input<typeof CreateUserRequest> => ({ ...user, roles: [role] }))
    .pipe(formContract(CreateUserRequest, (path) => (path[0] === 'roles' ? ['role'] : path)));

  const [passwordResetSent, setPasswordResetSent] = React.useState(false);

  const addNewUserMutation = useCreateUser({
    mutation: {
      onError: (error) => setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas dodawania użytkownika')),
    },
  });
  const updateUserMutation = useUpdateUser({
    mutation: {
      onError: (error) => setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas aktualizacji użytkownika')),
    },
  });
  const addUserRoleMutation = useAddUserRole();
  const removeUserRoleMutation = useRemoveUserRole();
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
  const initiatePasswordResetMutation = useRequestPasswordReset({
    mutation: {
      onError: (error) => setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas inicjowania zmiany hasła')),
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: user?.email ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      role: user?.roles[0] ?? '',
    },
    validationLogic: formValidationLogic,
    validators: {
      onDynamic: validationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      trackFormSubmit(editMode ? 'edit-user' : 'add-user', 'valid', formApi.state);
      const request = validationSchema.parse(value);

      if (editMode) {
        const loading = toast.loading('Zapisywanie zmian...');
        try {
          await updateUserMutation.mutateAsync({
            userId: user.id,
            data: UpdateUserRequest.parse(request),
          });
          const currentRole = user.roles[0];
          if (currentRole && currentRole !== value.role) {
            await removeUserRoleMutation.mutateAsync({ userId: user.id, roleName: currentRole });
            await addUserRoleMutation.mutateAsync({ userId: user.id, roleName: value.role });
          }
          toast.dismiss(loading);
          close();
          toast.success('Zaktualizowano użytkownika');
        } catch (err) {
          toast.dismiss(loading);
          console.error(err);
          toast.error('Nie udało się edytować użytkownika. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
          throw err;
        }
      } else {
        const loading = toast.loading('Dodawanie użytkownika...');
        try {
          await addNewUserMutation.mutateAsync({
            data: request,
          });
          toast.dismiss(loading);
          close();
          toast.success('Utworzono nowego użytkownika');
        } catch (err) {
          toast.dismiss(loading);
          console.error(err);
          toast.error('Nie udało się dodać użytkownika. Sprawdź, czy wszystkie pola są wypełnione poprawnie.');
          throw err;
        }
      }
    },
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit(editMode ? 'edit-user' : 'add-user', 'invalid', formApi.state);
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit().catch(() => {});
  }

  async function handleUserDeletion() {
    if (!editMode) {
      throw new Error('This method should be called only for existing users');
    }

    if (!deletionConfirmed) {
      setDeletionConfirmed(true);
      return;
    }

    if (user.roles.includes(Role.Administrator)) {
      const remainingAdmins = allUsers.filter((u) => u.id !== user.id && u.roles.includes(Role.Administrator));
      if (remainingAdmins.length === 0) {
        toast.error('Musi istnieć co najmniej jeden admin');
        setDeletionConfirmed(false);
        return;
      }
    }

    const loading = toast.loading('Usuwanie użytkownika...');
    try {
      await deleteUserMutation.mutateAsync({ userId: user.id });
      toast.dismiss(loading);
      close();
      toast.success('Użytkownik został usunięty');
    } catch (err) {
      toast.dismiss(loading);
      console.error(err);
      toast.error('Nie udało się usunąć użytkownika');
      throw err;
    }
  }

  async function handleAccountAcceptanceToggle() {
    if (!editMode) {
      throw new Error('This method should be called only for existing users');
    }

    if (!user.accepted) {
      const loading = toast.loading('Akceptowanie konta użytkownika...');
      try {
        await acceptUserMutation.mutateAsync({ userId: user.id });
        toast.dismiss(loading);
        close();
        toast.success('Zaakceptowano konto użytkownika');
      } catch (err) {
        toast.dismiss(loading);
        console.error(err);
        toast.error('Nie udało się zaakceptować konta użytkownika');
        throw err;
      }
    } else {
      const loading = toast.loading('Cofanie akceptacji konta użytkownika...');
      try {
        await unAcceptUserMutation.mutateAsync({ userId: user.id });
        toast.dismiss(loading);
        close();
        toast.success('Cofnięto akceptację konta użytkownika');
      } catch (err) {
        toast.dismiss(loading);
        console.error(err);
        toast.error('Nie udało się cofnąć akceptacji konta użytkownika');
        throw err;
      }
    }
  }

  async function handleInitiatePasswordReset() {
    if (!editMode) {
      throw new Error('This method should be called only for existing users');
    }

    await initiatePasswordResetMutation
      .mutateAsync(
        { data: { email: user.email } },
        {
          onSuccess: () => {
            setPasswordResetSent(true);
          },
        }
      )
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
        <form.AppField name="firstName" children={(field) => <field.TextField label="Imię" placeholder="Jan" />} />

        <form.AppField
          name="lastName"
          children={(field) => <field.TextField label="Nazwisko" placeholder="Kowalski" />}
        />

        <form.AppField
          name="email"
          children={(field) => <field.TextField label="Email" placeholder="jan.kowalski@example.com" type="email" />}
        />

        <form.AppField
          name="role"
          children={(field) => (
            <field.SelectField
              allOptions={Object.values(allowedRoles).map((role) => ({
                value: role,
                inlineLabel: getRoleLabel(role),
              }))}
              label="Rola"
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
