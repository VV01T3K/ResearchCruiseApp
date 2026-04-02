import type { CruisePeriodType } from '@/api/dto/applications/FormADto';
import { CruiseApplicationPeriodInput } from '@/components/applications/common/CruiseApplicationPeriodInput';

import { useNormalizedFieldErrors } from './shared';

export function CruisePeriodField({
  label,
  maxValues,
  minPeriodValue,
}: {
  label: React.ReactNode;
  maxValues?: CruisePeriodType | '';
  minPeriodValue?: number;
}) {
  const { field, normalizedErrors } = useNormalizedFieldErrors<CruisePeriodType | ''>();

  return (
    <CruiseApplicationPeriodInput
      name={field.name}
      value={field.state.value === '' ? undefined : field.state.value}
      maxValues={maxValues === '' ? undefined : maxValues}
      minPeriodValue={minPeriodValue}
      onChange={(value) => field.handleChange(value)}
      onBlur={field.handleBlur}
      errors={normalizedErrors?.map((error) => error.message)}
      label={label}
    />
  );
}
