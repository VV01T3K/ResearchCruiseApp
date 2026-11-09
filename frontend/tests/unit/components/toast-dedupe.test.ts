import { expect, it, vi } from 'vite-plus/test';
import { toast, toastManager } from '@/components/shared/layout/toast';

it('counts a repeated background error on its visible toast', () => {
  const add = vi.spyOn(toastManager, 'add').mockReturnValue('id');
  const update = vi.spyOn(toastManager, 'update').mockReturnValue();
  toast.backgroundError('Nie udało się odświeżyć danych');
  toast.backgroundError('Nie udało się odświeżyć danych');
  toast.backgroundError('Nie udało się odświeżyć danych');
  toast.backgroundError('Inny błąd');
  expect(add).toHaveBeenCalledTimes(2);
  expect(update).toHaveBeenLastCalledWith('id', expect.objectContaining({ data: { count: 3 } }));
  add.mock.calls[0][0].onClose?.();
  toast.backgroundError('Nie udało się odświeżyć danych');
  expect(add).toHaveBeenCalledTimes(3);
  expect(update).toHaveBeenCalledTimes(2);
});
