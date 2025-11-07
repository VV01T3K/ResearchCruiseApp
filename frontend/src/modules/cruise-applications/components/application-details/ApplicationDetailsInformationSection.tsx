import { AppAccordion } from '@/core/components/AppAccordion';
import { AppLink } from '@/core/components/AppLink';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { useApplicationDetails } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import { CruiseApplicationStatus } from '@/cruise-applications/models/CruiseApplicationDto';

export function ApplicationDetailsInformationSection() {
  const { application } = useApplicationDetails();
  const isFormBReadOnly =
    application.status !== CruiseApplicationStatus.FormBFilled &&
    application.status !== CruiseApplicationStatus.Undertaken;

  return (
    <AppAccordion title="1. Informacje o zgłoszeniu" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppInput name="number" value={application.number} label="Numer zgłoszenia:" showRequiredAsterisk disabled />
        <AppDatePickerInput name="date" value={application.date} label="Data wysłania:" showRequiredAsterisk disabled />
        <AppInput name="year" value={`${application.year}`} label="Rok rejsu:" showRequiredAsterisk disabled />
        <AppInput
          name="cruiseLeader"
          value={`${application.cruiseManagerFirstName} ${application.cruiseManagerLastName} (${application.cruiseManagerEmail})`}
          label="Kierownik:"
          showRequiredAsterisk
          disabled
        />
        <AppInput
          name="deputyManager"
          value={`${application.deputyManagerFirstName} ${application.deputyManagerLastName} (${application.deputyManagerEmail})`}
          label="Zastępca kierownika:"
          showRequiredAsterisk
          disabled
        />
        <div className="grid grid-cols-1 gap-1">
          <strong>Formularze:</strong>
          <AppLink href={`/applications/${application.id}/formA`} disabled={!application.hasFormA}>
            Formularz A
          </AppLink>
          <AppLink
            disabled={!application.hasFormB}
            href={`/applications/${application.id}/formB?mode=${isFormBReadOnly ? 'view' : 'preview'}`}
          >
            Formularz B
          </AppLink>
          <AppLink href={`/applications/${application.id}/formC`} disabled={!application.hasFormC}>
            Formularz C
          </AppLink>
        </div>
        <AppInput name="status" value={application.status} label="Status zgłoszenia:" showRequiredAsterisk disabled />
        <AppNumberInput name="points" value={application.points} label="Punkty:" showRequiredAsterisk disabled />
      </div>
    </AppAccordion>
  );
}
