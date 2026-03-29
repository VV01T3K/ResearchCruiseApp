import SearchIcon from 'bootstrap-icons/icons/search.svg?react';
import dayjs from 'dayjs';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppBadge } from '@/components/shared/AppBadge';
import { AppButton } from '@/components/shared/AppButton';
import { useFormC } from '@/contexts/applications/FormCContext';
import { ApplicationCruiseDto } from '@/api/dto/applications/ApplicationCruiseDto';

export function FormCCruiseInfoSection() {
  const { cruise } = useFormC();

  return (
    <AppAccordion title="1. Informacje o rejsie" expandedByDefault data-testid="form-c-cruise-info-section">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="grid grid-cols-1 gap-0 md:col-span-2 md:grid-cols-2 md:gap-2">
          <span className="font-semibold">Numer rejsu:</span>
          <span className="flex h-fit gap-4">
            {cruise.number} <CruiseStatusBadge status={cruise.status} />
          </span>
          <span className="mt-4 font-semibold md:mt-0">Terminy rozpoczęcia i zakończenia:</span>
          <span className="inline-flex gap-2 text-nowrap">
            <time dateTime={dayjs(cruise.startDate).toISOString()}>
              {dayjs(cruise.startDate).format('DD.MM.YYYY HH:mm')}
            </time>
            <span>-</span>
            <time dateTime={dayjs(cruise.endDate).toISOString()}>
              {dayjs(cruise.endDate).format('DD.MM.YYYY HH:mm')}
            </time>
          </span>
        </div>
        <div className="grid place-items-center">
          <AppButton type="link" href={`/cruises/${cruise.id}`} variant="primaryOutline" className="grid gap-4 py-3">
            <SearchIcon className="w-4" /> Pokaż szczegóły rejsu
          </AppButton>
        </div>
      </div>
    </AppAccordion>
  );
}

function CruiseStatusBadge({ status }: { status: ApplicationCruiseDto['status'] }) {
  if (status === 'Nowy') {
    return <AppBadge variant="info">Nowy</AppBadge>;
  }

  if (status === 'Potwierdzony') {
    return <AppBadge variant="success">Potwierdzony</AppBadge>;
  }

  if (status === 'Zakończony') {
    return <AppBadge variant="primary">Zakończony</AppBadge>;
  }

  return null;
}
