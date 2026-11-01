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
    const ignoreBlocker = evaluate(form.state.values, savedValues);
    const navigation = navigate({ ...options, ignoreBlocker });
    // A blocked navigation never settles if the user stays, which would keep the form submitting.
    if (ignoreBlocker) await navigation;
  };
}
