import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppGuard } from '@/components/shared/AppGuard';
import { Role } from '@/types/user';
import { ApplicationsSection } from './ApplicationsSection';
import { BasicInformationSection } from './BasicInformationSection';
import { DateSelectionSection } from './DateSelectionSection';
import { ManagerSelectionSection } from './ManagerSelectionSection';
import { useTypedAppFormContext } from '@/lib/form';
import { CruiseApplicationCandidate } from '@/routes/applications/$applicationId/-schemas/types/CruiseApplicationCandidate';
import { cruiseFormDefaultValues } from '@/routes/cruises/-schemas/form.schema';
import type { CruiseResponse } from '@/api/generated/schemas';

type Props = {
  cruise?: CruiseResponse;
  cruiseApplications: CruiseApplicationCandidate[];
  isReadonly: boolean;
  buttons: React.ReactNode;
};

export function FormView({ cruise, cruiseApplications, isReadonly, buttons }: Props) {
  const form = useTypedAppFormContext({ defaultValues: cruiseFormDefaultValues });
  return (
    <form
      className="space-y-8"
      onSubmit={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <BasicInformationSection cruise={cruise} isReadonly={isReadonly} />
      <DateSelectionSection isReadonly={isReadonly} />
      <ManagerSelectionSection cruise={cruise} cruiseApplications={cruiseApplications} isReadonly={isReadonly} />
      <ApplicationsSection cruiseApplications={cruiseApplications} isReadonly={isReadonly} />
      <AppGuard allowedRoles={[Role.ShipOwner, Role.Administrator]}>
        <AppActionsSection children={buttons} />
      </AppGuard>
    </form>
  );
}
