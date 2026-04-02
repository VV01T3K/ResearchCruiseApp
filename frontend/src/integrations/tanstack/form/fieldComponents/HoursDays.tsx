import { DualNumberField } from './DualNumber';

type HoursDaysFieldProps = {
  label?: React.ReactNode;
  rootTestId?: string;
  daysLabel?: string;
  hoursLabel?: string;
  daysTestId?: string;
  hoursTestId?: string;
  minHours?: number;
  maxHours?: number;
  maxDays?: number;
  dayStep?: number;
};

export function HoursDaysField({
  label,
  rootTestId,
  daysLabel = 'Liczba planowanych dób rejsowych',
  hoursLabel = 'Liczba planowanych godzin rejsowych',
  daysTestId,
  hoursTestId,
  minHours = 0,
  maxHours = 1440,
  maxDays = 60,
  dayStep = 0.25,
}: HoursDaysFieldProps) {
  return (
    <DualNumberField
      label={label}
      rootTestId={rootTestId}
      primaryLabel={daysLabel}
      secondaryLabel={hoursLabel}
      primaryTestId={daysTestId}
      secondaryTestId={hoursTestId}
      primaryMin={minHours / 24}
      primaryMax={maxDays}
      primaryStep={dayStep}
      secondaryMin={minHours}
      secondaryMax={maxHours}
      secondaryStep={1}
      primaryPrecision={2}
      secondaryPrecision={0}
      parseFieldValue={(value) => (typeof value === 'number' ? value : Number.parseInt(value || '0', 10))}
      formatFieldValue={(value) => value.toString()}
      normalizeCanonicalValue={(value) => Math.max(minHours, Math.min(maxHours, Math.round(value)))}
      toPrimaryValue={(hours) => hours / 24}
      fromPrimaryValue={(days) => days * 24}
      toSecondaryValue={(hours) => hours}
      fromSecondaryValue={(hours) => hours}
    />
  );
}
