import * as Sentry from '@sentry/react';
import { afterEach, expect, it, vi } from 'vite-plus/test';
import { ApiError } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { queryClient } from '@/integrations/tanstack/query/root-provider';

vi.mock('@/config', () => ({ default: { apiUrl: 'https://api.test' } }));
vi.mock('@sentry/react', () => ({ captureException: vi.fn() }));

afterEach(() => {
  queryClient.clear();
  vi.restoreAllMocks();
  vi.mocked(Sentry.captureException).mockClear();
});

it('reports failed actions that have no local error handler', async () => {
  const showError = vi.spyOn(toast, 'error').mockReturnValue('test');
  vi.mocked(Sentry.captureException).mockReturnValueOnce('event-1');
  const mutation = queryClient.getMutationCache().build(queryClient, {
    mutationKey: ['exportCruises'],
    mutationFn: async () => {
      throw new ApiError('Eksport nie powiódł się', 502);
    },
  });
  await expect(mutation.execute(undefined)).rejects.toThrow('Eksport nie powiódł się');
  expect(showError).toHaveBeenCalledExactlyOnceWith(
    'Operacja nie powiodła się: Eksport nie powiódł się',
    expect.objectContaining({
      props: expect.objectContaining({ context: { origin: 'toast', operation: 'exportCruises', eventId: 'event-1' } }),
    })
  );
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

it('captures a locally handled failure once after retries without its variables', async () => {
  const showError = vi.spyOn(toast, 'error').mockReturnValue('test');
  const onError = vi.fn();
  const error = new ApiError('Błąd serwera (502)', 502);
  const mutation = queryClient.getMutationCache().build(queryClient, {
    mutationKey: ['updateApplicationFormA'],
    meta: { handlesError: true },
    onError,
    retry: 1,
    retryDelay: 0,
    mutationFn: async (_: { email: string }) => {
      throw error;
    },
  });
  await expect(mutation.execute({ email: 'private@example.com' })).rejects.toBe(error);
  expect(Sentry.captureException).toHaveBeenCalledExactlyOnceWith(error, {
    tags: { 'mutation.key': 'updateApplicationFormA', 'http.status_code': 502 },
  });
  expect(onError).toHaveBeenCalledOnce();
  expect(showError).not.toHaveBeenCalled();
});

it('leaves failed first loads to the page that needs the data', async () => {
  const showError = vi.spyOn(toast, 'error').mockReturnValue('test');
  await expect(
    queryClient.query({
      queryKey: ['failure'],
      retry: false,
      queryFn: async () => {
        throw new ApiError('Serwer niedostępny', 503);
      },
    })
  ).rejects.toThrow('Serwer niedostępny');
  expect(showError).not.toHaveBeenCalled();
});

it('reports a failed background refresh once', async () => {
  const showError = vi.spyOn(toast, 'error').mockReturnValue('test');
  queryClient.setQueryData(['stale'], 'stare dane');
  await expect(
    queryClient.query({
      queryKey: ['stale'],
      staleTime: 0,
      retry: false,
      queryFn: async () => {
        throw new ApiError('Serwer niedostępny', 503);
      },
    })
  ).rejects.toThrow('Serwer niedostępny');
  expect(showError).toHaveBeenCalledExactlyOnceWith('Nie udało się odświeżyć danych: Serwer niedostępny');
});
