import { evaluate } from '@tanstack/react-form';
import { useRef } from 'react';

/**
 * Tracks a save so the unsaved-changes guard lets the user leave once the server has accepted it, while the
 * refetch still runs. After an accepted create nothing on the page can be saved again, so any values may leave.
 */
export function useSaveTracking({ creates = false } = {}) {
  const saving = useRef<{ values: unknown; accepted: boolean }>(undefined);
  return {
    start: (values: unknown) => {
      saving.current = { values, accepted: false };
    },
    finish: () => {
      saving.current = undefined;
    },
    onAccepted: () => {
      if (saving.current) saving.current.accepted = true;
    },
    isSaving: () => !!saving.current,
    isSaved: (values: unknown) => !!saving.current?.accepted && (creates || evaluate(values, saving.current.values)),
  };
}

export type SaveTracking = ReturnType<typeof useSaveTracking>;
