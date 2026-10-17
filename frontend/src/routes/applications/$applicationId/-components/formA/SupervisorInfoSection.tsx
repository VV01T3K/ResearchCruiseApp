import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppAlert } from '@/components/shared/AppAlert';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';

export function SupervisorInfoSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly } = context;

  return (
    <AppAccordion title="11. Dane kontaktowe przełożonego" expandedByDefault data-testid="form-a-supervisor-section">
      <div className="mx-auto max-w-180 space-y-4">
        <AppAlert variant="warning">
          <span className="text-center text-sm">
            Użytkownik odpowiada za podanie prawidłowego adresu e-mail przełożonego, a w przypadku fałszywych danych
            zgłoszenie może zostać odrzucone.
          </span>
        </AppAlert>
        <form.AppField
          name="supervisorEmail"
          children={(field) => (
            <field.TextField
              label="Adres e-mail przełożonego"
              showRequiredAsterisk
              placeholder="Wprowadź adres e-mail przełożonego"
              type="email"
              disabled={isReadonly}
              data-testid="form-a-supervisor-email-input"
              data-testid-errors="form-a-supervisor-email-errors"
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}
