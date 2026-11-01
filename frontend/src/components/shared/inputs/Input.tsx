import { hasErrors, invalidInputClassName } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
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
  const aria = useInputAria(errors, helper);
  const InputElement = type === 'textarea' ? 'textarea' : 'input';
  const elementRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (autoFocus && elementRef.current) {
      elementRef.current.focus({
        preventScroll: true,
      });
    }
  }, [autoFocus, elementRef]);

  return (
    <div className={cn('flex flex-col', containerClassName)}>
      <InputLabel name={aria.id} value={label} showRequiredAsterisk={showRequiredAsterisk} />

      <div className="relative flex">
        <InputElement
          name={name}
          value={value}
          placeholder={placeholder}
          type={type}
          onBlur={onBlur}
          onChange={(evt) => onChange?.(evt.target.value)}
          disabled={disabled}
          {...aria.inputProps}
          aria-label={ariaLabel}
          className={cn(
            className,
            'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
            'resize-none transition duration-300 ease-in-out',
            'focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none',
            disabled ? 'bg-gray-200' : '',
            hasErrors(errors) && invalidInputClassName
          )}
          ref={elementRef}
        />
        <InputErrorTriangle errors={errors} mode="absolute" />
      </div>

      <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
        <InputHelper id={aria.helperId} helper={helper} />
        <InputErrorsList id={aria.errorId} errors={errors} />
      </div>
    </div>
  );
}
