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
            'resize-none transition-[border-color,box-shadow] duration-150 ease-out',
            'focus:border-primary focus:shadow-sm focus:ring-primary focus:outline-hidden',
            disabled ? 'bg-neutral-200' : 'hover:border-neutral-400',
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
