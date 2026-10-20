import { type AnyFormApi, evaluate, getBy, setBy } from '@tanstack/react-form';
import { useBlocker, useLocation } from '@tanstack/react-router';
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { accountId, getSession } from '@/integrations/auth/session';
import { unsavedValues } from '@/integrations/tanstack/form/unsavedValues';

type Props = {
  form: Pick<AnyFormApi, 'state' | 'getFieldValue' | 'setFieldValue'>;
  defaultValues: Record<string, unknown>;
  disabled?: boolean;
  children: ReactNode;
};

function currentAccount() {
  const session = getSession();
  return session && accountId(session);
}

// An edited cell whose row no longer exists (e.g. deleted on the server) is dropped, not recreated partially.
function hasParent(values: unknown, name: string) {
  const parent = name.replace(/(\.[^.[\]]+|\[\d+\])$/, '');
  return parent === name || getBy(values, parent) !== undefined;
}

export function UnsavedChangesGuard({ form, defaultValues, disabled = false, children }: Props) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [restoredFor, setRestoredFor] = useState<boolean>();
  const appliedDefaults = useRef(defaultValues);
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
    // Parents first, so a restored array's rows exist before their edited cells.
    const saved = Object.entries(unsavedValues.get(pathname) ?? {}).sort(([a], [b]) => a.length - b.length);
    saved.forEach(([name, value]) => {
      if (hasParent(form.state.values, name)) form.setFieldValue(name, value, { dontValidate: true });
    });
    if (saved.length > 0) toast.success('Przywrócono niezapisane zmiany');
    const account = currentAccount();
    const save = () => {
      if (!getSession() || currentAccount() !== account) return;
      const edited = Object.keys(form.state.fieldMeta).filter((name) => form.state.fieldMeta[name]?.isDirty);
      if (edited.length > 0)
        unsavedValues.set(pathname, Object.fromEntries(edited.map((name) => [name, form.getFieldValue(name)])));
      else unsavedValues.delete(pathname);
    };
    window.addEventListener('pagehide', save);
    return () => {
      window.removeEventListener('pagehide', save);
      save();
    };
  }, [form, disabled, pathname]);

  // TanStack stops applying newer server values once a field is touched, as a restore does.
  // Fields and cells not edited here keep following them.
  useEffect(() => {
    if (evaluate(appliedDefaults.current, defaultValues)) return;
    appliedDefaults.current = defaultValues;
    // Newer server values with the local edits laid over them, parents first.
    const merged: Record<string, unknown> = Object.keys(form.state.fieldMeta)
      .filter((name) => form.state.fieldMeta[name]?.isDirty)
      .sort((a, b) => a.length - b.length)
      .reduce(
        (values, name) => (hasParent(values, name) ? setBy(values, name, getBy(form.state.values, name)) : values),
        defaultValues
      );
    Object.entries(merged)
      .filter(([name, value]) => !evaluate(value, form.state.values[name]))
      .forEach(([name, value]) => form.setFieldValue(name, value, { dontUpdateMeta: true }));
  });

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
