import type { ProblemDetails } from '@/api/generated/schemas';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly problem?: ProblemDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function responseErrorMessage(status: number, body: unknown): string {
  const problem = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : undefined;
  const messages =
    problem?.errors && typeof problem.errors === 'object'
      ? Object.values(problem.errors)
          .flat()
          .filter((message): message is string => typeof message === 'string' && !!message.trim())
      : [];
  const detail = typeof problem?.detail === 'string' ? problem.detail.trim() : '';
  if (detail || messages.length) return [...new Set([detail, ...messages].filter(Boolean))].join('\n');
  if (typeof problem?.message === 'string' && problem.message.trim()) return problem.message;
  const title = typeof problem?.title === 'string' ? problem.title.trim() : '';
  const standardTitles =
    /^(Bad Request|Unauthorized|Forbidden|Not Found|Conflict|Payload Too Large|Content Too Large|Unprocessable Entity|Too Many Requests|Internal Server Error|Bad Gateway|Service Unavailable|Gateway Timeout|One or more validation errors occurred\.?)$/i;
  if (title && !standardTitles.test(title)) return title;
  if (typeof body === 'string' && body.trim() && !/<(?:!doctype|html|body|head)\b/i.test(body)) return body.trim();
  const fallback: Record<number, string> = {
    400: 'Serwer odrzucił dane żądania. Sprawdź wpisane wartości.',
    401: 'Sesja wygasła lub dane logowania są nieprawidłowe. Zaloguj się ponownie.',
    403: 'Nie masz uprawnień do tej operacji lub stan zgłoszenia na nią nie pozwala.',
    404: 'Nie znaleziono żądanego zasobu. Mógł zostać usunięty.',
    409: 'Dane lub stan zgłoszenia zmieniły się. Spróbuj ponownie.',
    413: 'Przesyłane dane są zbyt duże. Zmniejsz rozmiar załączników.',
    422: 'Serwer nie może zaakceptować podanych danych.',
    429: 'Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.',
  };
  if (fallback[status]) return fallback[status];
  if (status >= 500) return `Błąd serwera (${status}). Spróbuj ponownie później.`;
  return typeof problem?.title === 'string' && problem.title.trim()
    ? problem.title
    : `Żądanie nie powiodło się (HTTP ${status}).`;
}

export function getProblemDetail(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.cause) return getProblemDetail(error.cause, fallback);
  if (error instanceof TypeError) return 'Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.';
  return error instanceof Error && error.message ? error.message : fallback;
}

export function getErrorMessage(error: unknown, context: string) {
  return `${context}: ${getProblemDetail(error, 'Nieznany błąd. Spróbuj ponownie.')}`;
}
