import { afterEach, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { queryClient } from './root-provider';

afterEach(() => {
  queryClient.clear();
  vi.restoreAllMocks();
});

it('reports failed actions that have no local error handler', async () => {
  const showError = vi.spyOn(toast, 'error').mockReturnValue('test');
  const mutation = queryClient.getMutationCache().build(queryClient, {
    mutationFn: async () => {
      throw new ApiError('Brak uprawnień do eksportu', 403);
    },
  });
  await expect(mutation.execute(undefined)).rejects.toThrow('Brak uprawnień');
  expect(showError).toHaveBeenCalledExactlyOnceWith('Operacja nie powiodła się: Brak uprawnień do eksportu');
});

it('leaves form errors to the form without a duplicate notification', async () => {
  const showError = vi.spyOn(toast, 'error').mockReturnValue('test');
  const mutation = queryClient.getMutationCache().build(queryClient, {
    meta: { handlesError: true },
    mutationFn: async () => {
      throw new ApiError('Brakuje skanu', 400);
    },
  });
  await expect(mutation.execute(undefined)).rejects.toThrow('Brakuje skanu');
  expect(showError).not.toHaveBeenCalled();
});

it('reports failed data loading', async () => {
  const showError = vi.spyOn(toast, 'error').mockReturnValue('test');
  await expect(
    queryClient.fetchQuery({
      queryKey: ['failure'],
      retry: false,
      queryFn: async () => {
        throw new ApiError('Serwer niedostępny', 503);
      },
    })
  ).rejects.toThrow('Serwer niedostępny');
  expect(showError).toHaveBeenCalledExactlyOnceWith('Nie udało się wczytać danych: Serwer niedostępny');
});
