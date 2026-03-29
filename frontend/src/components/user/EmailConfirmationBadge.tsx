import { AppBadge } from '@/components/shared/AppBadge';

type Props = {
  emailConfirmed: boolean;
};

export function EmailConfirmationBadge({ emailConfirmed }: Props) {
  if (emailConfirmed) {
    return <AppBadge variant="success">Potwierdzony adres e-mail</AppBadge>;
  }

  return <AppBadge variant="danger">Niepotwierdzony adres e-mail</AppBadge>;
}
