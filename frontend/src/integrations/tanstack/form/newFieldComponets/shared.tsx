import { AnyFieldMeta } from '@tanstack/react-form';

type FieldErrorsProps = {
  meta: AnyFieldMeta;
  showAllErrors?: boolean;
};

type FieldErrorItem = {
  message?: string;
};

export function FieldErrors({ meta, showAllErrors }: FieldErrorsProps) {
  const uniqueMessages = getFieldErrorMessages(meta, showAllErrors);

  if (uniqueMessages.length === 0) return null;

  return (
    <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-sm text-danger" data-error="true">
      {uniqueMessages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
}

export function getVisibleFieldErrors(meta: AnyFieldMeta, showAllErrors = false): FieldErrorItem[] {
  if (!meta.isTouched || meta.errors.length === 0) return [];

  const errors = showAllErrors ? meta.errors : meta.errors.slice(0, 1);
  const uniqueErrors = errors.filter(
    (error, index, items) => items.findIndex((item) => item.message === error.message) === index
  );

  return uniqueErrors.map((error) => ({
    message: error.message,
  }));
}

export function getFieldErrorMessages(meta: AnyFieldMeta, showAllErrors = false) {
  const uniqueMessages = getVisibleFieldErrors(meta, showAllErrors)
    .map((error) => error.message)
    .filter((message, index, messages): message is string => Boolean(message) && messages.indexOf(message) === index);

  return uniqueMessages;
}
