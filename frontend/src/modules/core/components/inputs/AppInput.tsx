import React from 'react';

import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { cn } from '@/core/lib/utils';

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
  'data-testid'?: string;
  'data-testid-errors'?: string;
};
export function AppInput({
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
  'data-testid': testId,
  'data-testid-errors': errorsTestId,
}: Props) {
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
      <AppInputLabel name={name} value={label} showRequiredAsterisk={showRequiredAsterisk} />

      <div className="relative flex">
        <InputElement
          name={name}
          value={value}
          placeholder={placeholder}
          type={type}
          onBlur={onBlur}
          onChange={(evt) => onChange?.(evt.target.value)}
          disabled={disabled}
          className={cn(
            className,
            'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
            'resize-none transition duration-300 ease-in-out',
            'focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none',
            disabled ? 'bg-gray-200' : '',
            errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
          )}
          ref={elementRef}
          data-testid={testId}
        />
        <AppInputErrorTriangle errors={errors} mode="absolute" />
      </div>

      <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2' : '')}>
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} data-testid={errorsTestId} />
      </div>
    </div>
  );
}
