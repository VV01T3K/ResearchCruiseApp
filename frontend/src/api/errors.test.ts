import { describe, expect, it } from 'vitest';
import { ApiError, getErrorMessage, responseErrorMessage } from './errors';

describe('API failure reasons', () => {
  it('preserves validation messages even without ProblemDetails.detail', () => {
    expect(
      responseErrorMessage(400, { errors: { 'Form.Permissions[0]': ['Brakuje skanu'], '': ['Nie można zapisać'] } })
    ).toBe('Brakuje skanu\nNie można zapisać');
  });
  it('preserves server details and plain text reasons', () => {
    expect(responseErrorMessage(409, { detail: 'Zgłoszenie zostało już zatwierdzone' })).toContain('już zatwierdzone');
    expect(responseErrorMessage(400, 'Nieprawidłowy plik')).toBe('Nieprawidłowy plik');
    expect(responseErrorMessage(400, { message: 'Nieprawidłowy plik' })).toBe('Nieprawidłowy plik');
  });
  it.each([400, 401, 403, 404, 409, 413, 422, 429, 500, 502, 503])('explains an empty HTTP %s failure', (status) => {
    expect(responseErrorMessage(status, null)).not.toMatch(/Request failed|undefined|Unknown/);
    expect(responseErrorMessage(status, null).length).toBeGreaterThan(20);
  });
  it('does not display an HTML proxy error page', () => {
    expect(responseErrorMessage(502, '<html><body>Bad gateway</body></html>')).toBe(
      'Błąd serwera (502). Spróbuj ponownie później.'
    );
  });
  it('retains the underlying reason when session refresh fails', () => {
    const error = new Error('Session refresh failed', { cause: new ApiError('Serwer jest niedostępny', 503) });
    expect(getErrorMessage(error, 'Nie zapisano')).toBe('Nie zapisano: Serwer jest niedostępny');
    expect(getErrorMessage(new TypeError('Failed to fetch'), 'Nie zapisano')).toContain('połączyć z serwerem');
  });
});
