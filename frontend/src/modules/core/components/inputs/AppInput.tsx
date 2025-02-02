import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  value: string;

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
}: Props) {
  const InputElement = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="flex flex-col">
      <AppInputLabel name={name} label={label} />

      <div className="flex relative">
        <InputElement
          name={name}
          value={value}
          placeholder={placeholder}
          type={type}
          onBlur={onBlur}
          onChange={(evt) => onChange && onChange(evt.target.value)}
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
        />
        <AppInputErrorTriangle errors={errors} />
      </div>
      <div className="flex flex-row justify-between mt-2 text-sm">
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}
