import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Accordion } from '@/components/shared/Accordion';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { formatDate } from '@/lib/dateUtils';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import type { CruiseResponse } from '@/api/generated/schemas';

export function CruiseInfoSection({ context }: { context: FormBViewModel }) {
  const { cruise } = context;

  return (
    <Accordion title="1. Informacje o rejsie" expandedByDefault>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="grid grid-cols-1 gap-0 md:col-span-2 md:grid-cols-2 md:gap-2">
          <span className="font-semibold">Numer rejsu:</span>
          <span className="flex h-fit gap-4">
            {cruise.number} <StatusBadge status={cruise.status} />
          </span>
          <span className="mt-4 font-semibold md:mt-0">Terminy rozpoczęcia i zakończenia:</span>
          <span className="inline-flex gap-2 text-nowrap">
            <time dateTime={new Date(cruise.startDate).toISOString()}>{formatDate(cruise.startDate, 'dateTime')}</time>
            <span>-</span>
            <time dateTime={new Date(cruise.endDate).toISOString()}>{formatDate(cruise.endDate, 'dateTime')}</time>
          </span>
        </div>
        <div className="grid place-items-center">
          <Button type="link" href={`/cruises/${cruise.id}`} variant="primaryOutline">
            <MagnifyingGlassIcon className="w-4" /> Pokaż szczegóły rejsu
          </Button>
        </div>
      </div>
    </Accordion>
  );
}

function StatusBadge({ status }: { status: CruiseResponse['status'] }) {
  if (status === 'new') {
    return <Badge variant="info">Nowy</Badge>;
  }

  if (status === 'confirmed') {
    return <Badge variant="success">Potwierdzony</Badge>;
  }

  if (status === 'ended') {
    return <Badge variant="primary">Zakończony</Badge>;
  }

  return null;
}
