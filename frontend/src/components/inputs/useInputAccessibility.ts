import { useId, type ReactNode } from 'react';

export function useInputAccessibility(errors: string[] | undefined, helper: ReactNode) {
  const id = useId();
  const errorId = `${id}-errors`;
  const helperId = `${id}-helper`;
  return {
    id,
    errorId,
    helperId,
    control: {
      id,
      'aria-invalid': Boolean(errors?.length),
      'aria-describedby':
        [helper ? helperId : '', errors?.length ? errorId : ''].filter(Boolean).join(' ') || undefined,
    },
  };
}
