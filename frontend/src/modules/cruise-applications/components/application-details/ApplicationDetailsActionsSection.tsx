import React from 'react';

import { AppActionsSection } from '@/core/components/AppActionsSection';
import { AppGuard } from '@/core/components/AppGuard';
import { Role } from '@/core/models/Role';
import { ApplicationDetailsActionAccept } from '@/cruise-applications/components/application-details/actions-section-buttons/ApplicationDetailsActionAccept';
import { ApplicationDetailsActionCancel } from '@/cruise-applications/components/application-details/actions-section-buttons/ApplicationDetailsActionCancel';
import { ApplicationDetailsActionCancelConfirmation } from '@/cruise-applications/components/application-details/actions-section-buttons/ApplicationDetailsActionCancelConfirmation';
import { useApplicationDetails } from '@/cruise-applications/contexts/ApplicationDetailsContext';
import { CruiseApplicationStatus } from '@/cruise-applications/models/CruiseApplicationDto';

type Props = {
  onAccept: () => void;
  onReject: () => void;
};
export function ApplicationDetailsActionsSection({ onAccept, onReject }: Props) {
  const { application } = useApplicationDetails();
  const [confirmationMode, setConfirmationMode] = React.useState(false);

  if (confirmationMode) {
    return (
      <AppActionsSection>
        <ApplicationDetailsActionCancelConfirmation onReject={onReject} setConfirmationMode={setConfirmationMode} />
      </AppActionsSection>
    );
  }

  switch (application.status) {
    case CruiseApplicationStatus.WaitingForSupervisor:
      return (
        <AppActionsSection>
          <ApplicationDetailsActionCancel setConfirmationMode={setConfirmationMode} />
        </AppActionsSection>
      );
    case CruiseApplicationStatus.AcceptedBySupervisor:
      return (
        <AppGuard allowedRoles={[Role.Administrator, Role.ShipOwner]}>
          <AppActionsSection>
            <ApplicationDetailsActionCancel setConfirmationMode={setConfirmationMode} />
            <ApplicationDetailsActionAccept onAccept={onAccept} />
          </AppActionsSection>
        </AppGuard>
      );
    default:
      return null;
  }
}
