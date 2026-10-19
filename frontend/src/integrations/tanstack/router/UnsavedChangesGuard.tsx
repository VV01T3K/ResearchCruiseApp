import type { AnyFormApi } from '@tanstack/react-form';
import { useBlocker, useLocation } from '@tanstack/react-router';
import { type ReactNode, useLayoutEffect, useState } from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { accountId, getSession } from '@/integrations/auth/session';
import { unsavedValues } from '@/integrations/tanstack/form/unsavedValues';

type Props = {
  form: Pick<AnyFormApi, 'state' | 'setFieldValue'>;
  disabled?: boolean;
  children: ReactNode;
};

function currentAccount() {
  const session = getSession();
  return session && accountId(session);
}

export function UnsavedChangesGuard({ form, disabled = false, children }: Props) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [restoredFor, setRestoredFor] = useState<boolean>();
  const hasUnsavedChanges = () => !disabled && form.state.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) =>
      hasUnsavedChanges() &&
      (current.pathname !== next.pathname || JSON.stringify(current.search) !== JSON.stringify(next.search)),
    enableBeforeUnload: hasUnsavedChanges,
    disabled,
    withResolver: true,
  });

  // Restores before the form renders, so sections initialise from the restored values.
  useLayoutEffect(() => {
    setRestoredFor(disabled);
    if (disabled) return;
    const saved = Object.entries(unsavedValues.get(pathname) ?? {});
    saved.forEach(([name, value]) => form.setFieldValue(name, value, { dontValidate: true }));
    if (saved.length > 0) toast.success('Przywrócono niezapisane zmiany');
    const account = currentAccount();
    return () => {
      if (!getSession() || currentAccount() !== account) return;
      const edited = Object.entries(form.state.fieldMeta)
        .filter(([, meta]) => meta?.isDirty)
        .map(([name]) => name.split(/[.[]/)[0]);
      if (edited.length > 0)
        unsavedValues.set(pathname, Object.fromEntries(edited.map((name) => [name, form.state.values[name]])));
      else unsavedValues.delete(pathname);
    };
  }, [form, disabled, pathname]);

  return (
    <>
      {restoredFor === disabled && children}
      <AppModal title="Niezapisane zmiany" isOpen={blocker.status === 'blocked'} onClose={() => blocker.reset?.()}>
        <div className="space-y-4">
          <p>Formularz zawiera niezapisane zmiany. Jeśli opuścisz stronę, mogą zostać utracone.</p>
          <div className="flex flex-wrap justify-end gap-4">
            <AppButton variant="primaryOutline" onClick={() => blocker.reset?.()}>
              Zostań na stronie
            </AppButton>
            <AppButton variant="danger" onClick={() => blocker.proceed?.()}>
              Opuść bez zapisywania
            </AppButton>
          </div>
        </div>
      </AppModal>
    </>
  );
}
