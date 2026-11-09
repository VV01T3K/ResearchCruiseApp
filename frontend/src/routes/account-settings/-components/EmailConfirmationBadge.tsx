import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { toast } from '@/components/shared/layout/toast';
import { useResendConfirmationEmail } from '@/api/generated/endpoints/auth.gen';

type Props = {
  email: string;
  emailConfirmed: boolean;
};

export function EmailConfirmationBadge({ email, emailConfirmed }: Props) {
  const resendConfirmation = useResendConfirmationEmail();

  if (emailConfirmed) {
    return <Badge variant="success">Potwierdzony adres e-mail</Badge>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Badge variant="danger">Niepotwierdzony adres e-mail</Badge>
      <Button
        size="xs"
        variant="primaryOutline"
        loading={resendConfirmation.isPending}
        onClick={() =>
          resendConfirmation.mutate(
            { data: { email } },
            {
              onSuccess: () => toast.success('Wiadomość potwierdzająca została wysłana ponownie'),
            }
          )
        }
      >
        Wyślij ponownie
      </Button>
    </span>
  );
}
