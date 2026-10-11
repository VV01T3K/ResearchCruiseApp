import type { AnyFormApi } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';
import React from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppModal } from '@/components/shared/AppModal';

type Props = {
  form: Pick<AnyFormApi, 'state'>;
  disabled?: boolean;
};

/**
 * Asks for confirmation before an in-app navigation, browser Back/Forward, reload or tab close
 * would discard edits.
 *
 * Some fields normalise their value while mounting (the cruise-period sliders clamp an empty
 * period to the earliest allowed one), so the form's default values are not a reliable baseline.
 * Instead the values are snapshotted at the user's first pointer, keyboard or text input, and
 * only differences from that snapshot count as unsaved edits.
 *
 * Navigation started while the form is submitting (the post-save redirect) is never blocked.
 */
export function UnsavedChangesGuard({ form, disabled = false }: Props) {
  const baseline = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    baseline.current = undefined;
    if (disabled) return;

    const captureBaseline = (event: Event) => {
      if (event.isTrusted && baseline.current === undefined) {
        baseline.current = JSON.stringify(form.state.values);
      }
    };
    // beforeinput also covers typing, paste and drop that skip pointer and key events.
    const events = ['pointerdown', 'keydown', 'beforeinput'];
    const options = { capture: true, passive: true };
    events.forEach((type) => document.addEventListener(type, captureBaseline, options));
    return () => events.forEach((type) => document.removeEventListener(type, captureBaseline, options));
  }, [disabled, form]);

  const hasUnsavedChanges = () =>
    !disabled &&
    !form.state.isSubmitting &&
    baseline.current !== undefined &&
    JSON.stringify(form.state.values) !== baseline.current;

  const blocker = useBlocker({
    shouldBlockFn: ({ current, next }) =>
      hasUnsavedChanges() &&
      (current.pathname !== next.pathname || JSON.stringify(current.search) !== JSON.stringify(next.search)),
    enableBeforeUnload: hasUnsavedChanges,
    disabled,
    withResolver: true,
  });

  return (
    <AppModal title="Niezapisane zmiany" isOpen={blocker.status === 'blocked'} onClose={() => blocker.reset?.()}>
      <div className="space-y-4">
        <p>Formularz zawiera niezapisane zmiany. Jeśli opuścisz stronę, zostaną utracone.</p>
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
