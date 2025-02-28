import { FieldMeta } from '@tanstack/react-form';
import clsx, { ClassValue } from 'clsx';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getErrors(field: FieldMeta, hasFormBeenSubmitted: boolean = true): string[] | undefined {
  if ((!hasFormBeenSubmitted && field.isPristine) || field.errors.length === 0) {
    return undefined;
  }

  return field.errors.map((error) => error!.toString());
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

export function removeEmptyValues<T extends object>(obj: T, excludeKeys: (keyof T)[] = []): T {
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
