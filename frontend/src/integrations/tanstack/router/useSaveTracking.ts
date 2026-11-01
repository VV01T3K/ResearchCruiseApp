import { evaluate } from '@tanstack/react-form';
import { useRef } from 'react';

/** Tracks a save so the unsaved-changes guard lets the user leave once the server has accepted it, while the refetch still runs. */
export function useSaveTracking() {
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
    acceptedValues: () => (saving.current?.accepted ? saving.current.values : undefined),
    isSaved: (values: unknown) => !!saving.current?.accepted && evaluate(values, saving.current.values),
  };
}

export type SaveTracking = ReturnType<typeof useSaveTracking>;
