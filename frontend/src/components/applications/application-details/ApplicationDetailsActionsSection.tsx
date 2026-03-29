import React from 'react';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppGuard } from '@/components/shared/AppGuard';
import { Role } from '@/models/shared/Role';
import { ApplicationDetailsActionAccept } from '@/components/applications/application-details/actions-section-buttons/ApplicationDetailsActionAccept';
import { ApplicationDetailsActionCancel } from '@/components/applications/application-details/actions-section-buttons/ApplicationDetailsActionCancel';
import { ApplicationDetailsActionCancelConfirmation } from '@/components/applications/application-details/actions-section-buttons/ApplicationDetailsActionCancelConfirmation';
import { useApplicationDetails } from '@/contexts/applications/ApplicationDetailsContext';
import { CruiseApplicationStatus } from '@/api/dto/applications/CruiseApplicationDto';

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
