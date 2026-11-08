import { Accordion } from '@/components/shared/Accordion';
import { Alert } from '@/components/shared/Alert';
import { withForm } from '@/integrations/tanstack/form/hook';
import { cruiseFormDefaultValues } from '@/features/cruises/schemas/form.schema';
import { StatusBadge } from './StatusBadge';
import type { CruiseResponse } from '@/api/generated/schemas';

export const BasicInformationSection = withForm({
  defaultValues: cruiseFormDefaultValues,
  props: {} as { cruise?: CruiseResponse; isReadonly: boolean },
  render: function Render({ form, cruise, isReadonly }) {
    return (
      <form.Subscribe selector={(state) => state.values.shipUnavailable}>
        {(shipUnavailable) => (
          <Accordion title={`1. Podstawowe informacje o ${shipUnavailable ? 'blokadzie' : 'rejsie'}`} expandedByDefault>
            <>
              {cruise && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="flex gap-4">
                    <div className="font-bold">Numer rejsu:</div>
                    <div>{cruise.number}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="font-bold">Status:</div>
                    <div>
                      <StatusBadge status={cruise.status} />
                    </div>
                  </div>
                </div>
              )}
              {!cruise && <Alert>Numer i status rejsu będą dostępne po jego utworzeniu</Alert>}
              <div className="mt-2 flex flex-col space-y-2">
                <form.AppField name="title">
                  {(field) => (
                    <field.TextField
                      label={shipUnavailable ? 'Tytuł blokady' : 'Tytuł rejsu'}
                      placeholder="np. Rejs specjalny, Serwis silnika, Zmiana załogi..."
                      disabled={isReadonly}
                    />
                  )}
                </form.AppField>
              </div>
            </>
          </Accordion>
        )}
      </form.Subscribe>
    );
  },
});
