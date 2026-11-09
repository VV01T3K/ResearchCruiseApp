import { hasErrors, invalidInputClassName } from '@/components/inputs/invalidInput';
import { Field } from '@base-ui/react/field';
import React from 'react';

import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { cn } from '@/lib/utils';

type Props = {
  value: string;

  name?: string;
  type?: 'text' | 'password' | 'email' | 'textarea';
  variant?: 'floating';
  placeholder?: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  errors?: string[];
  label?: React.ReactNode;
  showRequiredAsterisk?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
  autoFocus?: boolean;
  containerClassName?: string;
  'aria-label'?: string;
};
export function Input({
  name,
  value,
  type = 'text',
  variant,
  placeholder,
  onBlur,
  onChange,
  errors,
  label,
  showRequiredAsterisk,
  className,
  disabled,
  helper,
  autoFocus,
  containerClassName,
  'aria-label': ariaLabel,
}: Props) {
  const elementRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (autoFocus && elementRef.current) {
      elementRef.current.focus({
        preventScroll: true,
      });
    }
  }, [autoFocus, elementRef]);

  const messages = (
    <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
      {helper && <Field.Description render={<InputHelper helper={helper} />} />}
      {hasErrors(errors) && <Field.Error match render={<InputErrorsList errors={errors} />} />}
    </div>
  );

  if (variant === 'floating') {
    return (
      <Field.Root invalid={hasErrors(errors)} className={cn('group relative z-0 mb-5 w-full', containerClassName)}>
        <Field.Control
          type={type}
          name={name}
          aria-labelledby={undefined}
          className={cn(
            'focus:border-primary peer block w-full appearance-none border-0 border-b-2 border-neutral-600 bg-transparent px-0 py-2.5 focus:ring-0 focus:outline-none forced-colors:focus:border-b-4 forced-colors:focus:border-b-[Highlight] forced-colors:focus:pb-2',
            hasErrors(errors) &&
              'border-danger text-danger focus:border-danger focus:shadow-[0_1px_0_var(--color-danger)]'
          )}
          placeholder=""
          value={value}
          onBlur={onBlur}
          onValueChange={onChange}
          disabled={disabled}
        />
        <InputErrorTriangle errors={errors} mode="absolute" />
        <Field.Label
          className={cn(
            'peer-focus:text-primary absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-neutral-800 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
            hasErrors(errors) && 'text-danger peer-focus:text-danger'
          )}
        >
          {label}
        </Field.Label>
        {messages}
      </Field.Root>
    );
  }

  return (
    <Field.Root invalid={hasErrors(errors)} className={cn('flex flex-col', containerClassName)}>
      {label && <Field.Label render={<InputLabel value={label} showRequiredAsterisk={showRequiredAsterisk} />} />}

      <div className="relative flex">
        <Field.Control
          render={type === 'textarea' ? <textarea /> : undefined}
          name={name}
          value={value}
          placeholder={placeholder}
          type={type}
          onBlur={onBlur}
          onValueChange={onChange}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={undefined}
          className={cn(
            'block w-full rounded-lg border border-border bg-surface-muted p-2.5 text-sm text-foreground',
            'resize-none transition duration-300 ease-in-out',
            'focus:border-primary focus:shadow-sm focus:ring-primary focus:outline-hidden',
            disabled ? 'bg-neutral-200' : '',
            hasErrors(errors) && invalidInputClassName,
            className
          )}
          ref={elementRef}
        />
        <InputErrorTriangle errors={errors} mode="absolute" />
      </div>

      {messages}
    </Field.Root>
  );
}
