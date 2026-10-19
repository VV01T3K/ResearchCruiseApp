import { type AnyFormApi, evaluate, getBy } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { type NavigateOptions, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

export function useLeaveAfterSave(form: Pick<AnyFormApi, 'state' | 'reset'>) {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });
  const queryClient = useQueryClient();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return async (savedValues: unknown, options: NavigateOptions) => {
    if (!isMounted.current) {
      const saved = Object.entries(queryClient.getQueryData<Record<string, unknown>>(['unsaved-form', pathname]) ?? {});
      if (saved.every(([name, value]) => evaluate(value, getBy(savedValues, name))))
        queryClient.removeQueries({ queryKey: ['unsaved-form', pathname], exact: true });
      return;
    }
    const unchanged = evaluate(form.state.values, savedValues);
    if (unchanged) form.reset(form.state.values);
    await navigate({ ...options, ignoreBlocker: unchanged });
  };
}
