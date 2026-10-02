import { describe, expect, it } from 'vitest';
import { ApiError, getErrorMessage, responseErrorMessage } from '@/api/errors';

describe('API failure reasons', () => {
  it('joins the detail with distinct validation messages', () => {
    expect(
      responseErrorMessage(400, {
        detail: ' Zgłoszenie jest zablokowane ',
        errors: {
          'Form.Permissions[0]': ['Brakuje skanu', 'Zgłoszenie jest zablokowane'],
          '': ['Nie można zapisać', ' '],
          Form: ['Brakuje skanu'],
        },
      })
    ).toBe('Zgłoszenie jest zablokowane\nBrakuje skanu\nNie można zapisać');
  });
  it('uses validation messages without a detail and a detail without validation messages', () => {
    expect(responseErrorMessage(400, { errors: { 'Form.Permissions[0]': ['Brakuje skanu'] } })).toBe('Brakuje skanu');
    expect(responseErrorMessage(409, { detail: 'Zgłoszenie zostało już zatwierdzone' })).toBe(
      'Zgłoszenie zostało już zatwierdzone'
    );
  });
  it.each([
    [400, 'Żądanie nie powiodło się (HTTP 400).'],
    [404, 'Żądanie nie powiodło się (HTTP 404).'],
    [429, 'Żądanie nie powiodło się (HTTP 429).'],
    [500, 'Błąd serwera (500). Spróbuj ponownie później.'],
    [502, 'Błąd serwera (502). Spróbuj ponownie później.'],
  ])('falls back to a generic message for an HTTP %s failure without a detail', (status, message) => {
    expect(responseErrorMessage(status, null)).toBe(message);
  });
  it.each([
    ['a title only', { title: 'Too many requests.' }],
    ['a message property', { message: 'Nieprawidłowy plik' }],
    ['plain text', 'Nieprawidłowy plik'],
    ['an HTML proxy error page', '<html><body>Bad gateway</body></html>'],
  ])('ignores %s from a response that is not API ProblemDetails', (_, body) => {
    expect(responseErrorMessage(502, body)).toBe('Błąd serwera (502). Spróbuj ponownie później.');
  });
  it('retains the underlying reason when session refresh fails', () => {
    const error = new Error('Session refresh failed', { cause: new ApiError('Serwer jest niedostępny', 503) });
    expect(getErrorMessage(error, 'Nie zapisano')).toBe('Nie zapisano: Serwer jest niedostępny');
    expect(getErrorMessage(new TypeError('Failed to fetch'), 'Nie zapisano')).toContain('połączyć z serwerem');
  });
});
