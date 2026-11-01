import { hasErrors } from '@/components/inputs/invalidInput';

type Props = {
  id?: string;
  errors: string[] | undefined;
};
export function AppInputErrorsList({ id, errors }: Props) {
  if (!hasErrors(errors)) {
    return null;
  }

  if (errors.length === 1) {
    return (
      <p id={id} className="text-danger" data-error="true">
        {errors[0]}
      </p>
    );
  }

  return (
    <ul id={id} className="list-disc ps-4 text-danger">
      {errors.map((error) => (
        <li key={error} data-error="true">
          {error}
        </li>
      ))}
    </ul>
  );
}
