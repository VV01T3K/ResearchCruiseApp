import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppLink } from '@/components/shared/AppLink';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { useApplicationDetails } from '@/contexts/applications/ApplicationDetailsContext';
import { ApplicationStatus } from '@/api-v2/applications/contracts';

export function InformationSection() {
  const { application } = useApplicationDetails();
  const isFormBReadOnly =
    application.status !== ApplicationStatus.FormBFilled && application.status !== ApplicationStatus.Undertaken;

  return (
    <AppAccordion title="1. Informacje o zgłoszeniu" expandedByDefault>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AppInput name="number" value={application.number} label="Numer zgłoszenia:" disabled />
        <AppDatePickerInput name="date" value={application.date} label="Data wysłania:" disabled />
        <AppInput
          name="cruiseLeader"
          value={`${application.mainManager.firstName} ${application.mainManager.lastName} (${application.mainManager.email})`}
          label="Kierownik:"
          disabled
        />
        <AppInput
          name="deputyManager"
          value={`${application.deputyManager.firstName} ${application.deputyManager.lastName} (${application.deputyManager.email})`}
          label="Zastępca kierownika:"
          disabled
        />
        <AppInput name="year" value={`${application.year}`} label="Rok rejsu:" disabled />
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
        <AppInput name="status" value={application.status} label="Status zgłoszenia:" disabled />
        <AppNumberInput name="points" value={application.points} label="Punkty:" disabled />
      </div>
    </AppAccordion>
  );
}
