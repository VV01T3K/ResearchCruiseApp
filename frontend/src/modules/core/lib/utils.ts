import { ValidationError } from '@tanstack/react-form';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function mapValidationErrors(errors: ValidationError[]): string[] | undefined {
  if (!errors.length) {
    return undefined;
  }

  return errors.map((error) => error!.toString());
}
