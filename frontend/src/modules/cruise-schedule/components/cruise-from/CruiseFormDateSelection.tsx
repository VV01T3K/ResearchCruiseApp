import { useStore } from '@tanstack/react-form';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { getErrors } from '@/core/lib/utils';
import { useCruiseForm } from '@/cruise-schedule/contexts/CruiseFormContext';

export function CruiseFormDateSelectionSection() {
  const { form, isReadonly, hasFormBeenSubmitted } = useCruiseForm();

  const cruiseStart = useStore(form.store, (state) => state.values.startDate);
  const cruiseStartDate = cruiseStart !== '' ? new Date(cruiseStart) : undefined;

  return (
    <AppAccordion title="2. Termin rejsu" expandedByDefault>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.Field
            name="startDate"
            children={(field) => (
              <AppDatePickerInput
                name={field.name}
                value={field.state.value}
                onChange={(value) => field.handleChange(value as string)}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label="Data rozpoczęcia rejsu"
                required
                placeholder="Wybierz datę rozpoczęcia rejsu"
                type="datetime"
                minuteStep={30}
                disabled={isReadonly}
              />
            )}
          />

          <form.Field
            name="endDate"
            children={(field) => (
              <AppDatePickerInput
                name={field.name}
                value={field.state.value}
                onChange={(value) => field.handleChange(value as string)}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label="Data zakończenia rejsu"
                required
                placeholder="Wybierz datę zakończenia rejsu"
                type="datetime"
                minuteStep={30}
                disabled={isReadonly}
                minimalDate={cruiseStartDate}
                selectionStartDate={cruiseStartDate}
              />
            )}
          />
        </div>
      </div>
    </AppAccordion>
  );
}
