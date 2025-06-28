type Props = {
  errors: string[] | undefined;
};
export function AppInputErrorsList({ errors }: Props) {
  if (!errors) {
    return null;
  }

  if (errors.length === 1) {
    return (
      <p className="text-danger" data-error="true">
        {errors[0]}
      </p>
    );
  }

  return (
    <ul className="text-danger list-disc ps-4">
      {errors.map((error) => (
        <li key={error} data-error="true">
          {error}
        </li>
      ))}
    </ul>
  );
}
