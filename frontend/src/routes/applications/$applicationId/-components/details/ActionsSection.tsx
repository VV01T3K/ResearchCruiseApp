import React from 'react';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppGuard } from '@/components/shared/AppGuard';
import { Role } from '@/integrations/auth/types';
import { AcceptButton } from './actions/AcceptButton';
import { RejectButton } from './actions/RejectButton';
import { RejectConfirmation } from './actions/RejectConfirmation';
import { useApplication } from '@/routes/applications/$applicationId/-hooks/useApplicationDetails';
import { CruiseApplicationStatus } from '@/api/generated/schemas';

type Props = {
  onAccept: () => void;
  onReject: () => void;
};
export function ActionsSection({ onAccept, onReject }: Props) {
  const application = useApplication();
  const [confirmationMode, setConfirmationMode] = React.useState(false);

  if (confirmationMode) {
    return (
      <AppActionsSection>
        <RejectConfirmation onReject={onReject} setConfirmationMode={setConfirmationMode} />
      </AppActionsSection>
    );
  }

  switch (application.status) {
    case CruiseApplicationStatus.enum.waitingForSupervisor:
      return (
        <AppActionsSection>
          <RejectButton setConfirmationMode={setConfirmationMode} />
        </AppActionsSection>
      );
    case CruiseApplicationStatus.enum.acceptedBySupervisor:
      return (
        <AppGuard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
          <AppActionsSection>
            <RejectButton setConfirmationMode={setConfirmationMode} />
            <AcceptButton onAccept={onAccept} />
          </AppActionsSection>
        </AppGuard>
      );
    default:
      return null;
  }
}
