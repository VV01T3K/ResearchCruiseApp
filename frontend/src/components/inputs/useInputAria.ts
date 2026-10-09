import { useId, type ReactNode } from 'react';

export function useInputAria(errors: string[] | undefined, helper: ReactNode) {
  const id = useId();
  const errorId = `${id}-errors`;
  const helperId = `${id}-helper`;
  return {
    id,
    errorId,
    helperId,
    inputProps: {
      id,
      'aria-invalid': Boolean(errors?.length),
      'aria-describedby':
        [helper ? helperId : '', errors?.length ? errorId : ''].filter(Boolean).join(' ') || undefined,
    },
  };
}
