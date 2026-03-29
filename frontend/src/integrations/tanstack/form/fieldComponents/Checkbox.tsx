import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import CheckLgIcon from 'bootstrap-icons/icons/check-lg.svg?react';

import { cn } from '@/lib/utils';

import { FieldErrorsBlock, FieldLabel, useNormalizedFieldErrors } from './shared';

export function Checkbox({
  label,
  className,
  labelPosition = 'left',
}: {
  label?: React.ReactNode;
  className?: string;
  labelPosition?: 'top' | 'left';
}) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<boolean>();
  const checked = field.state.value === true;

  return (
    <div className={cn('flex flex-col', className)} data-invalid={hasError || undefined}>
      <div className={cn('flex items-center gap-2', labelPosition === 'left' ? 'flex-row' : 'flex-col')}>
        <FieldLabel htmlFor={field.name} label={label} className="mb-0" />
        <CheckboxPrimitive.Root
          id={field.name}
          name={field.name}
          checked={checked}
          onCheckedChange={(nextChecked) => field.handleChange(nextChecked === true)}
          onBlur={field.handleBlur}
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded-md border border-gray-300 transition-all duration-300',
            checked ? 'bg-primary border-primary text-white' : 'bg-white hover:border-gray-400',
            'cursor-pointer'
          )}
        >
          <CheckboxPrimitive.Indicator>
            <CheckLgIcon />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </div>
      <FieldErrorsBlock errors={normalizedErrors} />
    </div>
  );
}
