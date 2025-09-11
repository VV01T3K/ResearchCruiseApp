import { AppBadge } from '@/core/components/AppBadge';

type Props = {
  title?: string;
  shipUnavailable: boolean;
};
export function CruiseTitleBadge({ title, shipUnavailable }: Props) {
  if (shipUnavailable) {
    return <AppBadge variant="danger">{'Blokada ' + (title ?? '')}</AppBadge>;
  }
  return <AppBadge>{'Rejs ' + (title ?? '')}</AppBadge>;
}
