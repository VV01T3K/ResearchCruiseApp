import { AppBadge } from '@/components/shared/AppBadge';
import { CruiseStatus } from '@/api-v2/cruises/contracts';

type Props = {
  status: CruiseStatus;
};
export function StatusBadge({ status }: Props) {
  if (status === 'Nowy') {
    return <AppBadge variant="primary">Nowy</AppBadge>;
  } else if (status === 'Potwierdzony') {
    return <AppBadge variant="success">Potwierdzony</AppBadge>;
  } else if (status === 'Zakończony') {
    return <AppBadge variant="info">Zakończony</AppBadge>;
  } else {
    throw new Error(`Unknown cruise status: ${status}`);
  }
}
