import { AppBadge } from '@/components/shared/AppBadge';
import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { useResendConfirmationEmailMutation } from '@/api/account/AccountRecoveryApiHooks';

type Props = {
  email: string;
  emailConfirmed: boolean;
};

export function EmailConfirmationBadge({ email, emailConfirmed }: Props) {
  const resendConfirmation = useResendConfirmationEmailMutation();

  if (emailConfirmed) {
    return <AppBadge variant="success">Potwierdzony adres e-mail</AppBadge>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <AppBadge variant="danger">Niepotwierdzony adres e-mail</AppBadge>
      <AppButton
        size="xs"
        variant="primaryOutline"
        disabled={resendConfirmation.isPending}
        onClick={() =>
          resendConfirmation.mutate(
            { email },
            {
              onSuccess: () => toast.success('Wiadomość potwierdzająca została wysłana ponownie'),
              onError: () => toast.error('Nie udało się ponownie wysłać wiadomości potwierdzającej'),
            }
          )
        }
      >
        Wyślij ponownie
      </AppButton>
    </span>
  );
}
