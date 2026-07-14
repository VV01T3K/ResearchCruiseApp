import React from 'react';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppGuard } from '@/components/shared/AppGuard';
import { Role } from '@/models/shared/Role';
import { AcceptButton } from './actions/AcceptButton';
import { RejectButton } from './actions/RejectButton';
import { RejectConfirmation } from './actions/RejectConfirmation';
import { useApplicationDetails } from '@/contexts/applications/ApplicationDetailsContext';
import { ApplicationStatus } from '@/routes/applications/-types';

type Props = {
  onAccept: () => void;
  onReject: () => void;
};
export function ActionsSection({ onAccept, onReject }: Props) {
  const { application } = useApplicationDetails();
  const [confirmationMode, setConfirmationMode] = React.useState(false);

  if (confirmationMode) {
    return (
      <AppActionsSection>
        <RejectConfirmation onReject={onReject} setConfirmationMode={setConfirmationMode} />
      </AppActionsSection>
    );
  }

  switch (application.status) {
    case ApplicationStatus.WaitingForSupervisor:
      return (
        <AppActionsSection>
          <RejectButton setConfirmationMode={setConfirmationMode} />
        </AppActionsSection>
      );
    case ApplicationStatus.AcceptedBySupervisor:
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
