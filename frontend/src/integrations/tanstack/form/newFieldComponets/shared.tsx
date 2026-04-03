import { AnyFieldMeta } from '@tanstack/react-form';
import { CircleX } from 'lucide-react';
import { ZodError } from 'zod';

type FieldErrorsProps = {
  meta: AnyFieldMeta;
  showAllErrors?: boolean;
};

export function FieldErrors({ meta, showAllErrors }: FieldErrorsProps) {
  if (!meta.isTouched || meta.errors.length === 0) return null;
  const errors = showAllErrors ? meta.errors : meta.errors.slice(0, 1);
  const uniqueErrors = errors.filter(
    (error, index, errors) => errors.findIndex(({ message }) => message === error.message) === index
  );

  return (
    <ul className="mt-1 list-disc text-sm text-danger" data-error="true">
      {uniqueErrors.map(({ message }: ZodError, index) => (
        <li key={index} className="flex items-start gap-1">
          <CircleX className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </li>
      ))}
    </ul>
  );
}

export function getFieldErrorMessages(meta: AnyFieldMeta, showAllErrors = false) {
  if (!meta.isTouched || meta.errors.length === 0) return [];
  const errors = showAllErrors ? meta.errors : meta.errors.slice(0, 1);
  const uniqueMessages = errors
    .map((error) => error.message)
    .filter((message, index, messages) => messages.indexOf(message) === index);

  return uniqueMessages;
}
