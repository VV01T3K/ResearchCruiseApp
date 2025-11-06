import { FieldMeta, ReactFormExtendedApi } from '@tanstack/react-form';
import clsx, { ClassValue } from 'clsx';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface FormError {
  fieldName: string;
  errorMessage: string;
  sectionNumber?: number;
}

// Mapping of field names to section numbers for Form A
const formAFieldToSection: Record<string, number> = {
  cruiseManagerId: 1,
  deputyManagerId: 1,
  year: 2,
  acceptablePeriod: 2,
  optimalPeriod: 2,
  precisePeriodStart: 2,
  precisePeriodEnd: 2,
  cruiseHours: 2,
  periodNotes: 2,
  shipUsage: 2,
  differentUsage: 2,
  permissions: 3,
  researchAreaDescriptions: 4,
  cruiseGoal: 5,
  cruiseGoalDescription: 5,
  researchTasks: 6,
  contracts: 7,
  ugTeams: 8,
  guestTeams: 8,
  publications: 9,
  spubTasks: 10,
  supervisorEmail: 11,
  note: 11,
};

function getSectionNumberFromFieldName(fieldName: string): number | undefined {
  const directMatch = formAFieldToSection[fieldName];
  if (directMatch) {
    return directMatch;
  }

  return undefined;
}

export function getFirstFormError<TForm extends Record<string, unknown>>(
  form: ReactFormExtendedApi<TForm, undefined>
): FormError | null {
  const errors = (form.state as { fieldMeta: Record<string, { errors: unknown[] }> }).fieldMeta;

  for (const [fieldName, fieldMeta] of Object.entries(errors)) {
    if (fieldMeta.errors && fieldMeta.errors.length > 0) {
      const errorMessage = fieldMeta.errors[0]?.toString() || 'Błąd walidacji';
      const sectionNumber = getSectionNumberFromFieldName(fieldName);

      return {
        fieldName,
        errorMessage,
        sectionNumber,
      };
    }
  }

  return null;
}

export function getFormErrorMessage<TForm extends Record<string, unknown>>(
  form: ReactFormExtendedApi<TForm, undefined>
): string {
  const firstError = getFirstFormError(form);
  if (firstError) {
    return firstError.sectionNumber
      ? `Formularz błędny w sekcji nr ${firstError.sectionNumber}:\n${firstError.errorMessage}`
      : `Formularz zawiera błędy:\n ${firstError.errorMessage}`;
  }
  return 'Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.';
}

export function getErrors(field: FieldMeta, hasFormBeenSubmitted: boolean = true): string[] | undefined {
  if ((!hasFormBeenSubmitted && field.isPristine) || field.errors.length === 0) {
    return undefined;
  }

  return field.errors.map((error) => error!.toString());
}

function scrollToError(delay: number = 0): void {
  const scroll = () => {
    const errorElement = document.querySelector('[data-error="true"]');
    errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (delay > 0) {
    setTimeout(scroll, delay);
  } else {
    scroll();
  }
}

// it can be improved further to get rid of the small jump when expanding the accordion
export function navigateToFirstError<TForm extends Record<string, unknown>>(
  form?: ReactFormExtendedApi<TForm, undefined>
): void {
  const firstError = form ? getFirstFormError(form) : null;
  const sectionNumber = firstError?.sectionNumber;

  // Find and expand the accordion section containing the error
  const accordionButtons = Array.from(document.querySelectorAll('h2 button[data-expanded]'));
  const targetButton = accordionButtons.find((button) => {
    const title = button.querySelector('span')?.textContent || '';
    return title.includes(`${sectionNumber}.`);
  });

  const isExpanded = targetButton?.getAttribute('data-expanded') === 'true';

  if (!isExpanded) {
    (targetButton as HTMLButtonElement).click();
    scrollToError(50);
  } else {
    scrollToError();
  }
}

export function groupBy<T>(array: T[], key: (item: T) => string): [string, T[]][] {
  return Object.entries(
    array.reduce(
      (groups, item) => {
        const group = key(item);
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(item);
        return groups;
      },
      {} as Record<string, T[]>
    )
  );
}

export function roundNumber(value: number, precision: number) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function createModalPortal(modal: React.ReactNode): React.ReactPortal {
  return createPortal(modal, document.getElementById('modal-root') ?? document.body);
}

export function createFABPortal(fab: React.ReactNode): React.ReactPortal {
  return createPortal(fab, document.getElementById('fab-root') ?? document.body);
}

export function removeEmptyValues<T extends object>(obj: T, excludeKeys: (keyof T | (string & {}))[] = []): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => {
        if (excludeKeys.includes(key as keyof T)) {
          return true;
        }

        if (value === null || value === undefined) {
          return false;
        }

        if (typeof value === 'string' && value.trim() === '') {
          return false;
        }

        if (Array.isArray(value)) {
          const filteredArray = value
            .map((item) => (typeof item === 'object' ? removeEmptyValues(item, excludeKeys) : item))
            .filter((item) => item !== null && item !== undefined && (typeof item !== 'string' || item.trim() !== ''));
          return filteredArray.length > 0;
        }

        if (typeof value === 'object') {
          const nestedObj = removeEmptyValues(value, excludeKeys);
          return Object.keys(nestedObj).length > 0;
        }

        return true;
      })
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [
            key,
            value
              .map((item) => (typeof item === 'object' ? removeEmptyValues(item, excludeKeys) : item))
              .filter(
                (item) => item !== null && item !== undefined && (typeof item !== 'string' || item.trim() !== '')
              ),
          ];
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
          return [key, removeEmptyValues(value, excludeKeys)];
        }

        return [key, value];
      })
  ) as T;
}
