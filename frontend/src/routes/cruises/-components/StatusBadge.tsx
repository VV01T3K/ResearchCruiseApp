import { Badge } from '@/components/shared/Badge';
import type { CruiseResponse } from '@/api/generated/schemas';

type Props = {
  status: CruiseResponse['status'];
};
export function StatusBadge({ status }: Props) {
  if (status === 'new') {
    return <Badge variant="primary">Nowy</Badge>;
  } else if (status === 'confirmed') {
    return <Badge variant="success">Potwierdzony</Badge>;
  } else if (status === 'ended') {
    return <Badge variant="info">Zakończony</Badge>;
  } else {
    throw new Error(`Unknown cruise status: ${String(status)}`);
  }
}
