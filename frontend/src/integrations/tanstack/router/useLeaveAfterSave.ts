import { type AnyFormApi, evaluate } from '@tanstack/react-form';
import { type NavigateOptions, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

export function useLeaveAfterSave(form: Pick<AnyFormApi, 'state'>) {
  const navigate = useNavigate();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return async (savedValues: unknown, options: NavigateOptions) => {
    if (!isMounted.current) return;
    await navigate({ ...options, ignoreBlocker: evaluate(form.state.values, savedValues) });
  };
}
