import { AppBadge } from '@/components/shared/AppBadge';
import { CruiseStatus } from '@/api/cruises/contracts';

type Props = {
  status: CruiseStatus;
};
export function StatusBadge({ status }: Props) {
  if (status === 'new') {
    return <AppBadge variant="primary">Nowy</AppBadge>;
  } else if (status === 'confirmed') {
    return <AppBadge variant="success">Potwierdzony</AppBadge>;
  } else if (status === 'ended') {
    return <AppBadge variant="info">Zakończony</AppBadge>;
  } else {
    throw new Error(`Unknown cruise status: ${status}`);
  }
}
