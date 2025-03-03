import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  value: string;

  type?: 'text' | 'password' | 'email';
  onBlur?: () => void;
  onChange?: (value: string) => void;
  errors?: string[];
  label?: React.ReactNode;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
};
export function AppFloatingLabelInput({
  name,
  value,
  type = 'text',
  onBlur,
  onChange,
  errors,
  label,
  required,
  className,
  disabled,
  helper,
}: Props) {
  return (
    <div className={cn('relative z-0 w-full mb-5 group', className)}>
      <input
        type={type}
        name={name}
        id={name}
        className={cn(
          'block py-2.5 px-0 w-full bg-transparent border-0 border-b-2 appearance-none border-gray-600 focus:border-primary focus:outline-none focus:ring-0 peer',
          errors ? 'border-danger text-danger focus:border-danger' : ''
        )}
        placeholder={''}
        required={required}
        value={value}
        onBlur={onBlur}
        onChange={(evt) => onChange?.(evt.target.value)}
        disabled={disabled}
      />
      <AppInputErrorTriangle errors={errors} mode="absolute" />
      <label
        htmlFor={name}
        className={cn(
          'peer-focus:font-medium absolute text-gray-800 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6',
          errors ? 'text-danger peer-focus:text-danger' : ''
        )}
      >
        {label}
      </label>
      <div className="flex flex-col justify-between mt-2 text-sm">
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}
