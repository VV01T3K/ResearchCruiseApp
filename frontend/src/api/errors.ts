import type { HttpValidationProblemDetails } from '@/api/generated/schemas';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly problem?: HttpValidationProblemDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function responseErrorMessage(status: number, problem?: HttpValidationProblemDetails): string {
  const messages = [problem?.detail, ...Object.values(problem?.errors ?? {}).flat()]
    .map((message) => message?.trim())
    .filter((message): message is string => !!message);
  if (messages.length) return [...new Set(messages)].join('\n');
  // The API explains every failure in `detail`; this covers proxies and other non-API responses.
  return status >= 500
    ? `Błąd serwera (${status}). Spróbuj ponownie później.`
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
