import { describe, expect, it } from 'vitest';
import { ApiError, getErrorMessage, responseErrorMessage } from '@/api/errors';

describe('API failure reasons', () => {
  it('joins the detail with distinct validation messages', () => {
    expect(
      responseErrorMessage(400, {
        detail: ' Zgłoszenie jest zablokowane ',
        errors: {
          'form.permissions[0]': ['Brakuje skanu', 'Zgłoszenie jest zablokowane'],
          '': ['Nie można zapisać', ' '],
          form: ['Brakuje skanu'],
        },
      })
    ).toBe('Zgłoszenie jest zablokowane\nBrakuje skanu\nNie można zapisać');
  });
  it('uses validation messages without a detail and a detail without validation messages', () => {
    expect(responseErrorMessage(400, { errors: { 'form.permissions[0]': ['Brakuje skanu'] } })).toBe('Brakuje skanu');
    expect(responseErrorMessage(409, { detail: 'Zgłoszenie zostało już zatwierdzone' })).toBe(
      'Zgłoszenie zostało już zatwierdzone'
    );
  });
  it.each([
    [400, 'Żądanie nie powiodło się (HTTP 400).'],
    [429, 'Żądanie nie powiodło się (HTTP 429).'],
    [500, 'Błąd serwera (500). Spróbuj ponownie później.'],
    [502, 'Błąd serwera (502). Spróbuj ponownie później.'],
  ])('falls back to a generic message for an HTTP %s response without API ProblemDetails', (status, message) => {
    expect(responseErrorMessage(status)).toBe(message);
  });
  it('ignores fields other than detail and validation errors', () => {
    expect(responseErrorMessage(429, { title: 'Too many requests.' })).toBe('Żądanie nie powiodło się (HTTP 429).');
  });
  it('retains the underlying reason when session refresh fails', () => {
    const error = new Error('Session refresh failed', { cause: new ApiError('Serwer jest niedostępny', 503) });
    expect(getErrorMessage(error, 'Nie zapisano')).toBe('Nie zapisano: Serwer jest niedostępny');
    expect(getErrorMessage(new TypeError('Failed to fetch'), 'Nie zapisano')).toContain('połączyć z serwerem');
  });
});
