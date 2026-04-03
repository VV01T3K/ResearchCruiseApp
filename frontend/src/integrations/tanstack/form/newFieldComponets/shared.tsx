import { AnyFieldMeta } from '@tanstack/react-form';
import { CircleX } from 'lucide-react';

type FieldErrorsProps = {
  meta: AnyFieldMeta;
  showAllErrors?: boolean;
};

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return String(error);
}

export function getFieldErrorMessages(meta: Pick<AnyFieldMeta, 'errors'>, showAllErrors?: boolean) {
  const errors = showAllErrors ? meta.errors : meta.errors.slice(0, 1);

  return errors
    .map(getErrorMessage)
    .filter((message, index, messages) => messages.indexOf(message) === index);
}

export function FieldErrors({ meta, showAllErrors }: FieldErrorsProps) {
  if (!meta.isTouched || meta.errors.length === 0) return null;
  const errorMessages = getFieldErrorMessages(meta, showAllErrors);

  return (
    <ul className="mt-1 list-disc text-sm text-danger" data-error="true">
      {errorMessages.map((message, index) => (
        <li key={index} className="flex items-start gap-1">
          <CircleX className="mt-0.5 h-4 w-4 shrink-0" />
          {message}
        </li>
      ))}
    </ul>
  );
}
