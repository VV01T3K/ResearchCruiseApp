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
  required?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
  autoFocus?: boolean;
  containerClassName?: string;
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
  required,
  className,
  disabled,
  helper,
  autoFocus,
  containerClassName,
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
      <AppInputLabel name={name} value={label} />

      <div className="flex relative">
        <InputElement
          name={name}
          value={value}
          placeholder={placeholder}
          type={type}
          onBlur={onBlur}
          onChange={(evt) => onChange?.(evt.target.value)}
          required={required}
          disabled={disabled}
          className={cn(
            className,
            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5',
            'transition duration-300 ease-in-out resize-none',
            'focus:ring-blue-500 focus:border-blue-500 focus:shadow focus:outline-none',
            disabled ? 'bg-gray-200' : '',
            errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
          )}
          ref={elementRef}
        />
        <AppInputErrorTriangle errors={errors} mode="absolute" />
      </div>

      <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2' : '')}>
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}
