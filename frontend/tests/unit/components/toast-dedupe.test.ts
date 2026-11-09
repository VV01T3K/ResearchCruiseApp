import { expect, it, vi } from 'vite-plus/test';
import { toast, toastManager } from '@/components/shared/layout/toast';

it('shows a repeated error once while its toast is visible', () => {
  vi.useFakeTimers();
  const add = vi.spyOn(toastManager, 'add').mockReturnValue('id');
  toast.error('Nie udało się odświeżyć danych');
  toast.error('Nie udało się odświeżyć danych');
  toast.error('Inny błąd');
  expect(add).toHaveBeenCalledTimes(2);
  vi.advanceTimersByTime(5000);
  toast.error('Nie udało się odświeżyć danych');
  expect(add).toHaveBeenCalledTimes(3);
  vi.useRealTimers();
});
