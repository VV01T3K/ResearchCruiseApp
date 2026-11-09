import { useSelector } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getGetCruisesSuspenseQueryOptions } from '@/api/generated/endpoints/cruises.gen';
import { Accordion } from '@/components/shared/Accordion';
import { Alert } from '@/components/shared/Alert';
import { Checkbox } from '@/components/shared/inputs/Checkbox';
import { withForm } from '@/integrations/tanstack/form/hook';
import { formatDate, useNow } from '@/lib/dateUtils';
import { cruiseFormDefaultValues, findOverlappingCruises } from '@/features/cruises/schemas/form.schema';

export const DateSelectionSection = withForm({
  defaultValues: cruiseFormDefaultValues,
  props: {} as { cruiseId?: string; isReadonly: boolean },
  render: function Render({ form, cruiseId, isReadonly }) {
    const cruiseStart = useSelector(form.store, (state) => state.values.startDate);
    const cruiseEnd = useSelector(form.store, (state) => state.values.endDate);
    const cruiseStartDate = cruiseStart !== '' ? new Date(cruiseStart) : undefined;
    const cruisesQuery = useQuery({ ...getGetCruisesSuspenseQueryOptions(), enabled: !isReadonly });
    const overlapping = isReadonly
      ? []
      : findOverlappingCruises(cruisesQuery.data ?? [], cruiseStart, cruiseEnd, cruiseId);

    const [allowPastDates, setAllowPastDates] = useState(false);
    const nowMs = useNow((now) => now.setSeconds(0, 0));

    const minimalDateForStartDate = allowPastDates ? undefined : new Date(nowMs);

    return (
      <Accordion title="2. Termin rejsu" expandedByDefault>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.AppField name="startDate">
              {(field) => (
                <field.DateField
                  label="Data rozpoczęcia rejsu"
                  timeLabel="Godzina rozpoczęcia rejsu"
                  placeholder="Wybierz datę rozpoczęcia rejsu"
                  type="datetime"
                  disabled={isReadonly}
                  minimalDate={minimalDateForStartDate}
                />
              )}
            </form.AppField>

            <form.AppField name="endDate">
              {(field) => (
                <field.DateField
                  label="Data zakończenia rejsu"
                  timeLabel="Godzina zakończenia rejsu"
                  placeholder="Wybierz datę zakończenia rejsu"
                  type="datetime"
                  disabled={isReadonly}
                  minimalDate={cruiseStartDate}
                  selectionStartDate={cruiseStartDate}
                />
              )}
            </form.AppField>
            {!isReadonly && (
              <div className="lg:col-span-2">
                <Checkbox
                  name="allowPastDates"
                  checked={allowPastDates}
                  onChange={setAllowPastDates}
                  label="Zezwól na wybór dat z przeszłości"
                />
              </div>
            )}
          </div>
          {overlapping.length > 0 && (
            <Alert variant="warning">
              <div>
                <span className="font-bold">Termin pokrywa się z innymi wpisami, ale można go zapisać:</span>
                <ul className="mt-2 space-y-1 text-sm">
                  {overlapping.map((cruise) => (
                    <li key={cruise.id}>
                      <span className="font-bold">
                        {cruise.shipUnavailable ? `Blokada ${cruise.title}` : `Rejs ${cruise.number}`}
                      </span>
                      : {formatDate(cruise.startDate, 'dateTime')} - {formatDate(cruise.endDate, 'dateTime')}
                    </li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}
        </div>
      </Accordion>
    );
  },
});
