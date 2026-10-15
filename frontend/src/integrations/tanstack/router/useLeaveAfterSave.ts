import { type AnyFormApi, evaluate } from '@tanstack/react-form';
import { type NavigateOptions, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

/**
 * Leaves a form page after a successful save without the unsaved-changes prompt, but only when
 * nothing was lost: the form must still hold exactly the saved values, and the user must still be
 * on the page that started the save. Edits made while the save was pending keep the prompt, and a
 * save that finishes after the user already left does not navigate at all.
 */
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
