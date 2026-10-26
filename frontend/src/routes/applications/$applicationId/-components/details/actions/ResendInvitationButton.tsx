import { PaperPlaneTiltIcon } from '@phosphor-icons/react';

import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { useResendApplicationSupervisorReviewInvitation } from '@/api/generated/endpoints/applications.gen';

type Props = {
  applicationId: string;
};
export function ResendInvitationButton({ applicationId }: Props) {
  const resendMutation = useResendApplicationSupervisorReviewInvitation();

  return (
    <AppButton
      className="!justify-center gap-4 px-6"
      variant="primaryOutline"
      disabled={resendMutation.isPending || resendMutation.isSuccess}
      onClick={() =>
        resendMutation.mutate(
          { applicationId },
          { onSuccess: () => toast.success('Prośba o opinię została ponownie wysłana do przełożonego') }
        )
      }
    >
      <PaperPlaneTiltIcon className="h-4 w-4" />
      Wyślij ponownie do przełożonego
    </AppButton>
  );
}
