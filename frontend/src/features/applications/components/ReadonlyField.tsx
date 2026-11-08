import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  children: React.ReactNode;
  errors?: string[];
  className?: string;
};
export function ReadonlyField({ label, children, errors, className }: Props) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words whitespace-pre-line text-foreground">
        {errors ? (
          <InputErrorsList errors={errors} />
        ) : children === '' || children == null ? (
          <span className="text-muted-foreground">Nie podano</span>
        ) : (
          children
        )}
      </dd>
    </div>
  );
}
