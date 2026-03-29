import { useFormContext } from '../context';
import { PrimaryButton } from '../fieldComponents/shared';

export function SubscribeButton({
  label,
  loadingLabel,
  className,
}: {
  label: string;
  loadingLabel?: string;
  className?: string;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <PrimaryButton type="submit" disabled={isSubmitting} className={className}>
          {isSubmitting && loadingLabel ? loadingLabel : label}
        </PrimaryButton>
      )}
    </form.Subscribe>
  );
}
