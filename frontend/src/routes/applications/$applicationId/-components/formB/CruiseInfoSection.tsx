import { Search as SearchIcon } from 'lucide-react';
import dayjs from 'dayjs';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppBadge } from '@/components/shared/AppBadge';
import { AppButton } from '@/components/shared/AppButton';
import { useFormB } from '@/contexts/applications/FormBContext';
import type { CruiseResponse } from '@/api/generated/schemas';

export function CruiseInfoSection() {
  const { cruise } = useFormB();

  return (
    <AppAccordion title="1. Informacje o rejsie" expandedByDefault data-testid="form-b-cruise-info-section">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="grid grid-cols-1 gap-0 md:col-span-2 md:grid-cols-2 md:gap-2">
          <span className="font-semibold">Numer rejsu:</span>
          <span className="flex h-fit gap-4">
            {cruise.number} <StatusBadge status={cruise.status} />
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

function StatusBadge({ status }: { status: CruiseResponse['status'] }) {
  if (status === 'new') {
    return <AppBadge variant="info">Nowy</AppBadge>;
  }

  if (status === 'confirmed') {
    return <AppBadge variant="success">Potwierdzony</AppBadge>;
  }

  if (status === 'ended') {
    return <AppBadge variant="primary">Zakończony</AppBadge>;
  }

  return null;
}
