import { Accordion } from '@/components/shared/Accordion';
import { Alert } from '@/components/shared/Alert';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

export function SupervisorInfoSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly } = context;

  return (
    <Accordion title="11. Dane kontaktowe przełożonego" expandedByDefault>
      <div className="mx-auto max-w-180 space-y-4">
        <Alert variant="warning">
          <span className="text-center text-sm">
            Użytkownik odpowiada za podanie prawidłowego adresu e-mail przełożonego, a w przypadku fałszywych danych
            zgłoszenie może zostać odrzucone.
          </span>
        </Alert>
        <form.AppField name="supervisorEmail">
          {(field) => (
            <field.TextField
              label="Adres e-mail przełożonego"
              showRequiredAsterisk
              placeholder="Wprowadź adres e-mail przełożonego"
              type="email"
              disabled={isReadonly}
            />
          )}
        </form.AppField>
      </div>
    </Accordion>
  );
}
