import React from 'react';

import { FloatingActionsSection } from '@/components/shared/FloatingActionsSection';
import { Guard } from '@/components/shared/Guard';
import { Role } from '@/integrations/auth/types';
import { AcceptButton } from './actions/AcceptButton';
import { RejectButton } from './actions/RejectButton';
import { RejectConfirmation } from './actions/RejectConfirmation';
import { ResendInvitationButton } from './actions/ResendInvitationButton';
import { useApplication } from '@/features/applications/hooks/useApplicationDetails';
import { CruiseApplicationStatus } from '@/api/generated/schemas';

type Props = {
  onAccept: () => void;
  onReject: () => void;
  disabled: boolean;
};
export function ActionsSection({ onAccept, onReject, disabled }: Props) {
  const application = useApplication();
  const [confirmationMode, setConfirmationMode] = React.useState(false);

  if (confirmationMode) {
    return (
      <FloatingActionsSection>
        <RejectConfirmation onReject={onReject} setConfirmationMode={setConfirmationMode} disabled={disabled} />
      </FloatingActionsSection>
    );
  }

  switch (application.status) {
    case CruiseApplicationStatus.enum.waitingForSupervisor:
      return (
        <Guard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
          <FloatingActionsSection>
            <ResendInvitationButton applicationId={application.id} />
            <RejectButton setConfirmationMode={setConfirmationMode} />
          </FloatingActionsSection>
        </Guard>
      );
    case CruiseApplicationStatus.enum.acceptedBySupervisor:
      return (
        <Guard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
          <FloatingActionsSection>
            <RejectButton setConfirmationMode={setConfirmationMode} />
            <AcceptButton onAccept={onAccept} disabled={disabled} />
          </FloatingActionsSection>
        </Guard>
      );
    default:
      return null;
  }
}
