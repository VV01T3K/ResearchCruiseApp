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
    [400, 'Serwer odrzucił dane żądania. Sprawdź wpisane wartości.'],
    [401, 'Sesja wygasła lub dane logowania są nieprawidłowe. Zaloguj się ponownie.'],
    [403, 'Nie masz uprawnień do tej operacji lub stan zgłoszenia na nią nie pozwala.'],
    [404, 'Nie znaleziono żądanego zasobu. Mógł zostać usunięty.'],
    [409, 'Dane lub stan zgłoszenia zmieniły się. Spróbuj ponownie.'],
    [413, 'Przesyłane dane są zbyt duże. Zmniejsz rozmiar załączników.'],
    [422, 'Serwer nie może zaakceptować podanych danych.'],
    [429, 'Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.'],
    [500, 'Błąd serwera (500). Spróbuj ponownie później.'],
    [502, 'Błąd serwera (502). Spróbuj ponownie później.'],
    [503, 'Błąd serwera (503). Spróbuj ponownie później.'],
    [418, 'Żądanie nie powiodło się (HTTP 418).'],
  ])('explains an empty HTTP %s failure', (status, message) => {
    expect(responseErrorMessage(status, null)).toBe(message);
  });
  it.each([
    ['the rate limiter title', { title: 'Too many requests.' }],
    ['a custom title', { title: 'Limit eksportów został przekroczony.' }],
    ['a message property', { message: 'Nieprawidłowy plik' }],
    ['plain text', 'Nieprawidłowy plik'],
    ['an HTML proxy error page', '<html><body>Too many requests</body></html>'],
  ])('uses the status fallback for %s', (_, body) => {
    expect(responseErrorMessage(429, body)).toBe('Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.');
  });
  it('retains the underlying reason when session refresh fails', () => {
    const error = new Error('Session refresh failed', { cause: new ApiError('Serwer jest niedostępny', 503) });
    expect(getErrorMessage(error, 'Nie zapisano')).toBe('Nie zapisano: Serwer jest niedostępny');
    expect(getErrorMessage(new TypeError('Failed to fetch'), 'Nie zapisano')).toContain('połączyć z serwerem');
  });
});
