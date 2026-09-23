type Props = {
  id?: string;
  errors: string[] | undefined;
  'data-testid'?: string;
};
export function AppInputErrorsList({ id, errors, 'data-testid': testId }: Props) {
  if (!errors?.length) {
    return null;
  }

  if (errors.length === 1) {
    return (
      <p id={id} className="text-danger" data-error="true" data-testid={testId}>
        {errors[0]}
      </p>
    );
  }

  return (
    <ul id={id} className="list-disc ps-4 text-danger" data-testid={testId}>
      {[...new Set(errors)].map((error) => (
        <li key={error} data-error="true">
          {error}
        </li>
      ))}
    </ul>
  );
}
