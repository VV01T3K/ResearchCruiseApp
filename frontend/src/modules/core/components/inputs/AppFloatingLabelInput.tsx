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
  className?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
  'data-testid'?: string;
};
export function AppFloatingLabelInput({
  name,
  value,
  type = 'text',
  onBlur,
  onChange,
  errors,
  label,
  className,
  disabled,
  helper,
  'data-testid': testId,
}: Props) {
  return (
    <div className={cn('group relative z-0 mb-5 w-full', className)}>
      <input
        type={type}
        name={name}
        id={name}
        className={cn(
          'focus:border-primary peer block w-full appearance-none border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2.5 focus:ring-0 focus:outline-none',
          errors ? 'border-danger text-danger focus:border-danger' : ''
        )}
        placeholder={''}
        value={value}
        onBlur={onBlur}
        onChange={(evt) => onChange?.(evt.target.value)}
        disabled={disabled}
        data-testid={testId}
      />
      <AppInputErrorTriangle errors={errors} mode="absolute" />
      <label
        htmlFor={name}
        className={cn(
          'peer-focus:text-primary absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-gray-800 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
          errors ? 'text-danger peer-focus:text-danger' : ''
        )}
      >
        {label}
      </label>
      <div className="mt-2 flex flex-col justify-between text-sm">
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} />
      </div>
    </div>
  );
}
