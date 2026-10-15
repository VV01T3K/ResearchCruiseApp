import type { AnyFormApi } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';

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
 * Edits are detected through the form's dirty state: every user edit (typing, paste, autofill,
 * dictation, file drop, dropdowns) goes through `field.handleChange`, which marks the field dirty.
 * Fields that normalise their value on mount must write with `{ dontUpdateMeta: true }` so that
 * an untouched form stays clean.
 *
 * Protection stays on while a save is pending. Only the redirect after a successful save skips
 * it, through `useLeaveAfterSave`, and only when no edits were made after the save started.
 */
export function UnsavedChangesGuard({ form, disabled = false }: Props) {
  const hasUnsavedChanges = () => !disabled && form.state.isDirty;

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
