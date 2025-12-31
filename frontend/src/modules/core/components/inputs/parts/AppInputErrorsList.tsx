type Props = {
  errors: string[] | undefined;
  'data-testid'?: string;
};
export function AppInputErrorsList({ errors, 'data-testid': testId }: Props) {
  if (!errors) {
    return null;
  }

  if (errors.length === 1) {
    return (
      <p className="text-danger" data-error="true" data-testid={testId}>
        {errors[0]}
      </p>
    );
  }

  return (
    <ul className="text-danger list-disc ps-4" data-testid={testId}>
      {errors.map((error) => (
        <li key={error} data-error="true">
          {error}
        </li>
      ))}
    </ul>
  );
}
