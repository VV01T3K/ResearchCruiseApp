import { addIntegration, feedbackIntegration } from '@sentry/react';

const primary = '#0041d2';

export function addFeedbackWidget() {
  const feedback = feedbackIntegration({
    autoInject: false,
    showBranding: false,
    showName: false,
    enableScreenshot: false,
    colorScheme: 'light',
    themeLight: {
      accentBackground: primary,
      outline: `1px auto ${primary}`,
      errorColor: '#a10000',
      successColor: '#00a26c',
    },
    formTitle: 'Zgłoś problem',
    emailLabel: 'Adres e-mail do kontaktu',
    emailPlaceholder: 'jan.kowalski@example.com',
    messageLabel: 'Opis problemu',
    messagePlaceholder: 'Co się stało? Czego się spodziewano?',
    isRequiredLabel: '(wymagane)',
    submitButtonLabel: 'Wyślij zgłoszenie',
    cancelButtonLabel: 'Anuluj',
    confirmButtonLabel: 'Potwierdź',
    successMessageText: 'Dziękujemy za zgłoszenie!',
    errorEmptyMessageText: 'Opis problemu nie może być pusty.',
    errorNoClientText: 'Zgłaszanie problemów jest niedostępne. Napisz na rejsy.help@ug.edu.pl.',
    errorTimeoutText:
      'Nie udało się potwierdzić wysłania zgłoszenia. Spróbuj ponownie lub napisz na rejsy.help@ug.edu.pl.',
    errorForbiddenText: 'Nie udało się wysłać zgłoszenia. Napisz na rejsy.help@ug.edu.pl.',
    errorGenericText:
      'Nie udało się wysłać zgłoszenia. Sprawdź połączenie lub wyłącz blokowanie reklam, albo napisz na rejsy.help@ug.edu.pl.',
  });
  addIntegration(feedback);
  return feedback;
}
