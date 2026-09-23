type Props = {
  id?: string;
  helper: React.ReactNode | undefined;
};
export function AppInputHelper({ id, helper }: Props) {
  if (!helper) return null;

  return (
    <div id={id} className="text-gray-500">
      {helper}
    </div>
  );
}
