type Props = {
  errors: string[] | undefined;
};
export function AppInputErrorsList({ errors }: Props) {
  if (!errors) {
    return null;
  }

  return (
    <ul className="text-danger list-disc ps-4">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
