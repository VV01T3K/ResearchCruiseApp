import { Accordion } from '@/components/shared/Accordion';
import { Alert } from '@/components/shared/Alert';
import { Link } from '@/components/shared/Link';
import { ReadonlyField } from '@/features/applications/components/ReadonlyField';
import { useApplication } from '@/features/applications/hooks/useApplicationDetails';
import { mapPersonToText } from '@/lib/applications/PersonMappers';
import { canRevertFormB, getApplicationStatusLabel } from '@/lib/applications/status';
import { formatDate } from '@/lib/dateUtils';

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
      <dl className="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-2">
        <ReadonlyField label="Numer zgłoszenia">{application.number}</ReadonlyField>
        <ReadonlyField label="Data wysłania">{application.date && formatDate(application.date, 'date')}</ReadonlyField>
        <ReadonlyField label="Kierownik">{mapPersonToText(application.mainManager)}</ReadonlyField>
        <ReadonlyField label="Zastępca kierownika">{mapPersonToText(application.deputyManager)}</ReadonlyField>
        <ReadonlyField label="Rok rejsu">{application.year ?? 'Błędne dane'}</ReadonlyField>
        <ReadonlyField label="Formularze">
          <span className="flex gap-4">
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
          </span>
        </ReadonlyField>
        <ReadonlyField label="Status zgłoszenia">{getApplicationStatusLabel(application.status)}</ReadonlyField>
        <ReadonlyField label="Punkty">{application.points}</ReadonlyField>
      </dl>
    </Accordion>
  );
}
