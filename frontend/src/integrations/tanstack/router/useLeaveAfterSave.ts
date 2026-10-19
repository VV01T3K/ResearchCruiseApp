import { type AnyFormApi, evaluate } from '@tanstack/react-form';
import { type NavigateOptions, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

export function useLeaveAfterSave(form: Pick<AnyFormApi, 'state' | 'reset'>) {
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
    const unchanged = evaluate(form.state.values, savedValues);
    if (unchanged) form.reset(form.state.values);
    await navigate({ ...options, ignoreBlocker: unchanged });
  };
}
