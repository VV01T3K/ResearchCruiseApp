import { AppAccordion } from '@/components/shared/AppAccordion';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

export function SPUBReportDataSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly } = context;

  return (
    <AppAccordion
      title="17. Dodatkowe dane do raportu SPUB"
      expandedByDefault
      data-testid="form-c-spub-report-data-section"
    >
      <header className="mx-auto mb-8 max-w-2xl space-y-4 text-center text-sm">
        Wpisać czy podczas rejsu były pozyskane dane do ekspertyzy lub do oceny oddziaływań na środowisko przy
        współpracy z otoczeniem gospodarczym i biznesowym lub w celach popularnonaukowych, edukacyjnych,
        reprezentacyjnych, lub odbywając szkolenie doskonalące z wykonywania prac z wykorzystaniem aparatury
        naukowo-badawczej, itp.
      </header>
      <form.AppField
        name="spubReportData"
        children={(field) => (
          <field.TextField
            label="Dodatkowe dane do raportu SPUB"
            type="textarea"
            className="h-48"
            placeholder="Wpisz dodatkowe dane do raportu SPUB"
            disabled={isReadonly}
          />
        )}
      />
    </AppAccordion>
  );
}
