import { Badge } from '@/components/shared/Badge';
import type { CruiseResponse } from '@/api/generated/schemas';

export function getCruiseStatusLabel(status: CruiseResponse['status']): string {
  switch (status) {
    case 'new':
      return 'Nowy';
    case 'confirmed':
      return 'Potwierdzony';
    case 'ended':
      return 'Zakończony';
  }
}

type Props = {
  status: CruiseResponse['status'];
};
export function StatusBadge({ status }: Props) {
  const variant = status === 'new' ? 'primary' : status === 'confirmed' ? 'success' : 'info';
  return <Badge variant={variant}>{getCruiseStatusLabel(status)}</Badge>;
}
