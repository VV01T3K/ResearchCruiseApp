type Props = {
  id?: string;
  helper: React.ReactNode | undefined;
};
export function InputHelper({ id, helper }: Props) {
  if (!helper) return null;

  return (
    <div id={id} className="text-muted-foreground">
      {helper}
    </div>
  );
}
