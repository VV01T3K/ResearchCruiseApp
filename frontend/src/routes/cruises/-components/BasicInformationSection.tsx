import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppAlert } from '@/components/shared/AppAlert';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import { cruiseFormDefaultValues } from '@/routes/cruises/-schemas/form.schema';
import { StatusBadge } from './StatusBadge';
import type { CruiseResponse } from '@/api/generated/schemas';

export function BasicInformationSection({ cruise, isReadonly }: { cruise?: CruiseResponse; isReadonly: boolean }) {
  const form = useTypedAppFormContext({ defaultValues: cruiseFormDefaultValues });
  return (
    <form.Subscribe
      selector={(state) => state.values.shipUnavailable}
      children={(shipUnavailable) => (
        <AppAccordion
          title={`1. Podstawowe informacje o ${shipUnavailable ? 'blokadzie' : 'rejsie'}`}
          expandedByDefault
        >
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
            {!cruise && <AppAlert>Numer i status rejsu będą dostępne po jego utworzeniu</AppAlert>}
            <div className="mt-2 flex flex-col space-y-2">
              <form.AppField
                name="title"
                children={(field) => (
                  <field.TextField
                    label={shipUnavailable ? 'Tytuł blokady' : 'Tytuł rejsu'}
                    placeholder="np. Rejs specjalny, Serwis silnika, Zmiana załogi..."
                    disabled={isReadonly}
                  />
                )}
              />
            </div>
          </>
        </AppAccordion>
      )}
    />
  );
}
