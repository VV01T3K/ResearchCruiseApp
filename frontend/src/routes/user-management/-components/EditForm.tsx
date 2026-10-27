import type { CreateUserRequest, UpdateUserRequest, UserResponse } from '@/api/generated/schemas';
import { useAppForm } from '@/integrations/tanstack/form/hook';
import { formValidationLogic, selectCanSubmit } from '@/integrations/tanstack/form/validation';
import {
  EnvelopeSimpleIcon,
  FloppyDiskIcon,
  TrashIcon,
  UserCheckIcon,
  UserMinusIcon,
  UserPlusIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { z } from 'zod';

import { AppAlert } from '@/components/shared/AppAlert';
import { AppAvatar } from '@/components/shared/AppAvatar';
import { AppBadge } from '@/components/shared/AppBadge';
import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { trackFormSubmit } from '@/integrations/sentry/client';
import { navigateToFirstError } from '@/integrations/tanstack/form/errors';
import { getRoleLabel, Role } from '@/integrations/auth/types';
import {
  useAcceptUser,
  useCreateUser,
  useDeactivateUser,
  useDeleteUser,
  useReplaceUserRole,
  useUpdateUser,
} from '@/api/generated/endpoints/users.gen';
import { useRequestPasswordReset } from '@/api/generated/endpoints/auth.gen';
import { getProblemDetail } from '@/api/errors';
import { AssignmentsWarning, findActiveAssignments, type UserAssignments } from './AssignmentsWarning';

const editingRoles: string[] = [Role.Administrator, Role.ShipOwner, Role.CruiseManager];

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
  const [assignmentWarning, setAssignmentWarning] = React.useState<{
    action: 'role' | 'deactivate';
    items: UserAssignments[] | null;
  }>();

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
    });

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
  const replaceUserRoleMutation = useReplaceUserRole({
    mutation: {
      onError: (error) => setSubmitError(getProblemDetail(error, 'Wystąpił błąd podczas zmiany roli użytkownika')),
    },
  });
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
      const profile = { email: value.email, firstName: value.firstName, lastName: value.lastName };

      if (editMode) {
        const losesEditing = user.roles[0] !== value.role && !editingRoles.includes(value.role);
        if (losesEditing && !(await confirmAssignments('role'))) {
          return;
        }

        const loading = toast.loading('Zapisywanie zmian...');
        try {
          await updateUserMutation.mutateAsync({
            userId: user.id,
            data: profile satisfies UpdateUserRequest,
          });
          if (user.roles[0] !== value.role) {
            await replaceUserRoleMutation.mutateAsync({ userId: user.id, data: { roleName: value.role } });
          }
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
          await addNewUserMutation.mutateAsync({
            data: { ...profile, roles: [value.role] } satisfies CreateUserRequest,
          });
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
    onSubmitInvalid: ({ formApi }) => {
      trackFormSubmit(editMode ? 'edit-user' : 'add-user', 'invalid', formApi.state);
      navigateToFirstError();
    },
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  }

  async function confirmAssignments(action: 'role' | 'deactivate') {
    if (assignmentWarning?.action === action) {
      return true;
    }

    const items = await findActiveAssignments([user!]);
    if (items?.length === 0) {
      return true;
    }
    setAssignmentWarning({ action, items });
    return false;
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
      }
    } else {
      if (!(await confirmAssignments('deactivate'))) {
        return;
      }

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
    <form noValidate onSubmit={handleSubmit}>
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
          listeners={{ onChange: () => setAssignmentWarning(undefined) }}
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

        {assignmentWarning?.action === 'role' && <AssignmentsWarning items={assignmentWarning.items} action="role" />}

        <form.Subscribe
          selector={(state) => [selectCanSubmit(state), state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <AppButton type="submit" className="w-full" disabled={isSubmitting}>
                {assignmentWarning?.action === 'role' ? (
                  <div className="flex items-center gap-4">
                    <WarningIcon weight="fill" className="h-4 w-4" />
                    <span>Zmień rolę mimo to</span>
                  </div>
                ) : editMode ? (
                  <div className="flex items-center gap-4">
                    <FloppyDiskIcon weight="fill" className="h-4 w-4" />
                    <span>Zapisz</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <UserPlusIcon className="h-4 w-4" />
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
                      <WarningIcon weight="fill" className="h-4 w-4" />
                      <span>Czy na pewno?</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <TrashIcon weight="fill" className="h-4 w-4" />
                      <span>Usuń</span>
                    </div>
                  )}
                </AppButton>
              )}

              {assignmentWarning?.action === 'deactivate' && (
                <AssignmentsWarning items={assignmentWarning.items} action="deactivate" />
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
                      <UserCheckIcon weight="fill" className="h-4 w-4" />
                      <span>Zaakceptuj konto użytkownika</span>
                    </div>
                  ) : assignmentWarning?.action === 'deactivate' ? (
                    <div className="flex items-center gap-4">
                      <WarningIcon weight="fill" className="h-4 w-4" />
                      <span>Cofnij akceptację mimo to</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <UserMinusIcon weight="fill" className="h-4 w-4" />
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
                      <EnvelopeSimpleIcon className="h-4 w-4" />
                      <span>Link do zmiany hasła wysłany</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <EnvelopeSimpleIcon className="h-4 w-4" />
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
