import { type AnyFormApi, evaluate } from '@tanstack/react-form';
import { useBlocker, useLocation } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppModal } from '@/components/shared/AppModal';
import { toast } from '@/components/shared/layout/toast';
import { unsavedValues } from '@/integrations/tanstack/form/unsavedValues';

type Props = {
  form: Pick<AnyFormApi, 'state' | 'setFieldValue'>;
  disabled?: boolean;
};

export function UnsavedChangesGuard({ form, disabled = false }: Props) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const hasUnsavedChanges = () => !disabled && form.state.isDirty;

  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) =>
      hasUnsavedChanges() &&
      (current.pathname !== next.pathname || JSON.stringify(current.search) !== JSON.stringify(next.search)),
    enableBeforeUnload: hasUnsavedChanges,
    disabled,
    withResolver: true,
  });

  useLayoutEffect(() => {
    if (disabled) return;
    const changed = Object.entries(unsavedValues.get(pathname) ?? {}).filter(
      ([name, value]) => !evaluate(value, form.state.values[name])
    );
    changed.forEach(([name, value]) => form.setFieldValue(name, value, { dontValidate: true }));
    if (changed.length > 0) toast.success('Przywrócono niezapisane zmiany');
    return () => {
      if (form.state.isDirty) unsavedValues.set(pathname, form.state.values);
      else unsavedValues.delete(pathname);
    };
  }, [form, disabled, pathname]);

  return (
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
  );
}
