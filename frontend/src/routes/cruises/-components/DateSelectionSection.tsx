import { useSelector } from '@tanstack/react-form';
import { useState } from 'react';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { cruiseFormDefaultValues } from '@/routes/cruises/-schemas/form.schema';

export function DateSelectionSection({ isReadonly }: { isReadonly: boolean }) {
  const form = useTypedAppFormContext({ defaultValues: cruiseFormDefaultValues });
  const cruiseStart = useSelector(form.store, (state) => state.values.startDate);
  const cruiseStartDate = cruiseStart !== '' ? new Date(cruiseStart) : undefined;

  const [allowPastDates, setAllowPastDates] = useState(false);

  const minimalDateForStartDate = allowPastDates ? undefined : new Date();

  return (
    <AppAccordion title="2. Termin rejsu" expandedByDefault>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.AppField
            name="startDate"
            children={(field) => (
              <field.DateField
                label="Data rozpoczęcia rejsu"
                placeholder="Wybierz datę rozpoczęcia rejsu"
                type="datetime"
                minuteStep={30}
                disabled={isReadonly}
                minimalDate={minimalDateForStartDate}
              />
            )}
          />

          <form.AppField
            name="endDate"
            children={(field) => (
              <field.DateField
                label="Data zakończenia rejsu"
                placeholder="Wybierz datę zakończenia rejsu"
                type="datetime"
                minuteStep={30}
                disabled={isReadonly}
                minimalDate={cruiseStartDate}
                selectionStartDate={cruiseStartDate}
              />
            )}
          />
          {!isReadonly && (
            <div className="lg:col-span-2">
              <AppCheckbox
                name="allowPastDates"
                checked={allowPastDates}
                onChange={setAllowPastDates}
                label="Zezwól na wybór dat z przeszłości"
              />
            </div>
          )}
        </div>
      </div>
    </AppAccordion>
  );
}
