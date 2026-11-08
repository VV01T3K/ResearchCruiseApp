import { useQueryClient } from '@tanstack/react-query';

import { ApiError, getErrorMessage } from '@/api/errors';
import { toast } from '@/components/shared/layout/toast';
import { getGetApplicationQueryKey, useUpdateApplicationDecision } from '@/api/generated/endpoints/applications.gen';
import { useApplication } from '@/features/applications/hooks/useApplicationDetails';

import { ActionsSection } from './ActionsSection';
import { ContractsSection } from './ContractsSection';
import { EffectPointsSection } from './EffectPointsSection';
import { InformationSection } from './InformationSection';
import { MembersSection } from './MembersSection';
import { PublicationsSection } from './PublicationsSection';
import { ResearchAreaFilesSection } from './ResearchAreaFilesSection';
import { ResearchTasksSection } from './ResearchTasksSection';
import { SPUBTasksSection } from './SPUBTasksSection';

export function DetailsView() {
  const application = useApplication();
  const queryClient = useQueryClient();
  const decisionMutation = useUpdateApplicationDecision({
    mutation: {
      onError: async (error: unknown) => {
        toast.error(getErrorMessage(error, 'Operacja nie powiodła się'));
        if (error instanceof ApiError && error.status === 409) {
          await queryClient.invalidateQueries({ queryKey: getGetApplicationQueryKey(application.id) });
        }
      },
    },
  });

  function acceptApplication() {
    decisionMutation.mutate(
      { applicationId: application.id, data: { accept: true, revision: application.revision } },
      {
        onSuccess: () => {
          toast.success('Formularz został zaakceptowany');
        },
      }
    );
  }

  function rejectApplication() {
    decisionMutation.mutate(
      { applicationId: application.id, data: { accept: false, revision: application.revision } },
      {
        onSuccess: () => {
          toast.success('Formularz został odrzucony');
        },
      }
    );
  }

  return (
    <>
      <InformationSection />
      <ResearchTasksSection />
      <EffectPointsSection />
      <ContractsSection />
      <MembersSection />
      <PublicationsSection />
      <SPUBTasksSection />
      <ResearchAreaFilesSection />
      <ActionsSection onAccept={acceptApplication} onReject={rejectApplication} disabled={decisionMutation.isPending} />
    </>
  );
}
