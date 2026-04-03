import type { CruisePeriodType } from '@/api/dto/applications/FormADto';
import { CruiseApplicationPeriodInput } from '@/components/applications/common/CruiseApplicationPeriodInput';
import { useFieldContext } from '@/integrations/tanstack/form/context';

import { getFieldErrorMessages } from '../newFieldComponets/shared';

export function CruisePeriodField({
  label,
  maxValues,
  minPeriodValue,
}: {
  label: React.ReactNode;
  maxValues?: CruisePeriodType | '';
  minPeriodValue?: number;
}) {
  const field = useFieldContext<CruisePeriodType | ''>();

  return (
    <CruiseApplicationPeriodInput
      name={field.name}
      value={field.state.value === '' ? undefined : field.state.value}
      maxValues={maxValues === '' ? undefined : maxValues}
      minPeriodValue={minPeriodValue}
      onChange={(value) => field.handleChange(value)}
      onBlur={field.handleBlur}
      errors={field.state.meta.isTouched ? getFieldErrorMessages(field.state.meta, true) : undefined}
      label={label}
    />
  );
}
