import { AppAccordion } from '@/components/shared/AppAccordion';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { mapPersonToLabel } from '@/lib/applications/PersonMappers';

export function CruiseManagerInfoSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly, initValues } = context;

  return (
    <AppAccordion title="1. Kierownik zgłaszanego rejsu" expandedByDefault>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <form.AppField name="cruiseManagerId">
          {(field) => (
            <field.SelectField
              label="Kierownik rejsu"
              showRequiredAsterisk
              placeholder="Wybierz kierownika rejsu"
              allOptions={initValues.cruiseManagers.map(mapPersonToLabel)}
              disabled={isReadonly}
            />
          )}
        </form.AppField>

        <form.AppField name="deputyManagerId">
          {(field) => (
            <field.SelectField
              label="Zastępca kierownika rejsu"
              showRequiredAsterisk
              placeholder="Wybierz zastępcę kierownika rejsu"
              allOptions={initValues.deputyManagers.map(mapPersonToLabel)}
              disabled={isReadonly}
            />
          )}
        </form.AppField>

        <form.AppField name="year">
          {(field) => (
            <field.SelectField
              label="Rok"
              showRequiredAsterisk
              placeholder="Wybierz rok"
              allOptions={initValues.years.map((year) => ({
                value: year,
                inlineLabel: year,
              }))}
              disabled={isReadonly}
            />
          )}
        </form.AppField>
      </div>
    </AppAccordion>
  );
}
