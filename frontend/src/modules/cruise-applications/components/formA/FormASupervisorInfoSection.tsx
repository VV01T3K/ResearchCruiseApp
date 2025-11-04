import { AppAccordion } from '@/core/components/AppAccordion';
import { AppAlert } from '@/core/components/AppAlert';
import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';

export function FormASupervisorInfoSection() {
  const { form, isReadonly, hasFormBeenSubmitted } = useFormA();

  return (
    <AppAccordion title="11. Dane kontaktowe przełożonego" expandedByDefault>
      <div className="max-w-180 mx-auto space-y-4">
        <AppAlert variant="warning">
          <span className="text-sm text-center">
            Użytkownik odpowiada za podanie prawidłowego adresu e-mail przełożonego, a w przypadku fałszywych danych
            zgłoszenie może zostać odrzucone.
          </span>
        </AppAlert>
        <form.Field
          name="supervisorEmail"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Adres e-mail przełożonego"
              placeholder="Wprowadź adres e-mail przełożonego"
              type="email"
              disabled={isReadonly}
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}
