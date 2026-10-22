import { useId, type ReactNode } from 'react';

import { hasErrors } from '@/components/inputs/invalidInput';

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
      'aria-invalid': hasErrors(errors),
      'aria-describedby':
        [helper ? helperId : '', hasErrors(errors) ? errorId : ''].filter(Boolean).join(' ') || undefined,
    },
  };
}
