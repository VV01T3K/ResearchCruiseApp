type Props = {
  helper: React.ReactNode | undefined;
};
export function AppInputHelper({ helper }: Props) {
  if (!helper) return null;

  return <div className="text-gray-500">{helper}</div>;
}
