import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { cn } from '@/lib/utils';

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
};
export function FloatingLabelInput({
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
}: Props) {
  const aria = useInputAria(errors, helper);
  return (
    <div className={cn('group relative z-0 mb-5 w-full', className)}>
      <input
        type={type}
        name={name}
        {...aria.inputProps}
        className={cn(
          'focus:border-primary peer block w-full appearance-none border-0 border-b-2 border-neutral-600 bg-transparent px-0 py-2.5 focus:ring-0 focus:outline-none forced-colors:focus:border-b-4 forced-colors:focus:border-b-[Highlight] forced-colors:focus:pb-2',
          hasErrors(errors) &&
            'border-danger text-danger focus:border-danger focus:shadow-[0_1px_0_var(--color-danger)]'
        )}
        placeholder={''}
        value={value}
        onBlur={onBlur}
        onChange={(evt) => onChange?.(evt.target.value)}
        disabled={disabled}
      />
      <InputErrorTriangle errors={errors} mode="absolute" />
      <label
        htmlFor={aria.id}
        className={cn(
          'peer-focus:text-primary absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-neutral-800 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
          hasErrors(errors) && 'text-danger peer-focus:text-danger'
        )}
      >
        {label}
      </label>
      <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
        <InputHelper id={aria.helperId} helper={helper} />
        <InputErrorsList id={aria.errorId} errors={errors} />
      </div>
    </div>
  );
}
