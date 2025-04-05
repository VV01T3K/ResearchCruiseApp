import SearchIcon from 'bootstrap-icons/icons/search.svg?react';
import dayjs from 'dayjs';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppBadge } from '@/core/components/AppBadge';
import { AppButton } from '@/core/components/AppButton';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { CruiseDto } from '@/cruise-applications/models/CruiseDto';

export function FormCCruiseInfoSection() {
  const { cruise } = useFormC();

  return (
    <AppAccordion title="1. Informacje o rejsie" expandedByDefault>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-2">
          <span className="font-semibold ">Numer rejsu:</span>
          <span className="flex gap-4 h-fit">
            {cruise.number} <CruiseStatusBadge status={cruise.status} />
          </span>
          <span className="font-semibold mt-4 md:mt-0">Terminy rozpoczęcia i zakończenia:</span>
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

function CruiseStatusBadge({ status }: { status: CruiseDto['status'] }) {
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
