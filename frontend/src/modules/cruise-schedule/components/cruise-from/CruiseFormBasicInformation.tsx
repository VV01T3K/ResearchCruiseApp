import { useStore } from '@tanstack/react-form';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppAlert } from '@/core/components/AppAlert';
import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors } from '@/core/lib/utils';
import { CruiseStatusBadge } from '@/cruise-schedule/components/CruiseStatusBadge';
import { useCruiseForm } from '@/cruise-schedule/contexts/CruiseFormContext';

export function CruiseFormBasicInformationSection() {
  const { cruise, form, hasFormBeenSubmitted, isReadonly } = useCruiseForm();
  const shipUnavailable = useStore(form.store, (state) => state.values.shipUnavailable);

  return (
    <AppAccordion title={`1. Podstawowe informacje o ${shipUnavailable ? 'blokadzie' : 'rejsie'}`} expandedByDefault>
      <>
        {cruise && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex gap-4">
              <div className="font-bold">Numer rejsu:</div>
              <div>{cruise.number}</div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold">Status:</div>
              <div>
                <CruiseStatusBadge status={cruise.status} />
              </div>
            </div>
          </div>
        )}
        {!cruise && <AppAlert>Numer i status rejsu będą dostępne po jego utworzeniu</AppAlert>}
        <div className="flex flex-col space-y-2 mt-2">
          <form.Field
            name="title"
            children={(field) => (
              <AppInput
                name={field.name}
                value={field.state.value || ''}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label={shipUnavailable ? 'Tytuł blokady' : 'Tytuł rejsu'}
                placeholder="np. Rejs specjalny, Serwis silnika, Zmiana załogi..."
                disabled={isReadonly}
                required={field.form.getFieldValue('shipUnavailable')}
              />
            )}
          />
        </div>
      </>
    </AppAccordion>
  );
}
