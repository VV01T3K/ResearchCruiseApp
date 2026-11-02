import { useEffect } from 'react';
import { reportUnreadableValue } from '@/integrations/sentry/client';

/** Number and boolean fields hold a string only when the stored value couldn't be read. */
export function useUnreadableErrors(name: string, value: unknown, disabled?: boolean): string[] | undefined {
  const unreadable = typeof value === 'string';
  useEffect(() => {
    if (unreadable) reportUnreadableValue(name);
  }, [unreadable, name]);
  if (!unreadable) return undefined;
  return [
    `Nie udało się odczytać wcześniej zapisanej odpowiedzi: „${value}”.${disabled ? '' : ' Wprowadź ją jeszcze raz.'}`,
  ];
}
