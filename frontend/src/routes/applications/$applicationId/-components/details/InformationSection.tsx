import { Accordion } from '@/components/shared/Accordion';
import { Alert } from '@/components/shared/Alert';
import { Link } from '@/components/shared/Link';
import { Input } from '@/components/shared/inputs/Input';
import { NumberInput } from '@/components/shared/inputs/NumberInput';
import { DatePickerInput } from '@/components/shared/inputs/dates/DatePickerInput';
import { useApplication } from '@/routes/applications/$applicationId/-hooks/useApplicationDetails';
import { mapPersonToText } from '@/lib/applications/PersonMappers';
import { canRevertFormB, getApplicationStatusLabel } from '@/lib/applications/status';

export function InformationSection() {
  const application = useApplication();
  const isFormBReadOnly = !canRevertFormB(application.status);

  return (
    <Accordion title="1. Informacje o zgłoszeniu" expandedByDefault>
      {application.invalidStoredValues.length > 0 && (
        <div className="mb-4">
          <Alert variant="danger">Niepoprawne zapisane dane: {application.invalidStoredValues.join(', ')}.</Alert>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Input name="number" value={application.number} label="Numer zgłoszenia:" disabled />
        <DatePickerInput name="date" value={application.date} label="Data wysłania:" disabled />
        <Input name="cruiseLeader" value={mapPersonToText(application.mainManager)} label="Kierownik:" disabled />
        <Input
          name="deputyManager"
          value={mapPersonToText(application.deputyManager)}
          label="Zastępca kierownika:"
          disabled
        />
        <Input name="year" value={application.year?.toString() ?? 'Niepoprawna wartość'} label="Rok rejsu:" disabled />
        <div className="grid grid-cols-1 gap-1">
          <strong>Formularze:</strong>
          <Link href={`/applications/${application.id}/formA`} disabled={!application.hasFormA}>
            Formularz A
          </Link>
          <Link
            disabled={!application.hasFormB}
            href={`/applications/${application.id}/formB?mode=${isFormBReadOnly ? 'view' : 'preview'}`}
          >
            Formularz B
          </Link>
          <Link href={`/applications/${application.id}/formC`} disabled={!application.hasFormC}>
            Formularz C
          </Link>
        </div>
        <Input
          name="status"
          value={getApplicationStatusLabel(application.status)}
          label="Status zgłoszenia:"
          disabled
        />
        <NumberInput name="points" value={application.points} label="Punkty:" disabled />
      </div>
    </Accordion>
  );
}
