import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppGuard } from '@/components/shared/AppGuard';
import { Role } from '@/models/shared/Role';
import { CruiseFormApplicationsSection } from './CruiseFormApplications';
import { CruiseFormBasicInformationSection } from './CruiseFormBasicInformation';
import { CruiseFormDateSelectionSection } from './CruiseFormDateSelection';
import { CruiseFormManagerSelectionSection } from './CruiseFormManagerSelection';
import { CruiseFormProvider, CruiseFromContextType } from '@/contexts/cruises/CruiseFormContext';

type Props = {
  context: CruiseFromContextType;
  buttons: React.ReactNode;

  onSubmit?: () => void;
};

export function CruiseFrom({ context, buttons, onSubmit }: Props) {
  return (
    <CruiseFormProvider value={context}>
      <form
        className="space-y-8"
        onSubmit={(evt) => {
          evt.preventDefault();
          onSubmit?.();
        }}
      >
        <CruiseFormBasicInformationSection />
        <CruiseFormDateSelectionSection />
        <CruiseFormManagerSelectionSection />
        <CruiseFormApplicationsSection />
        <AppGuard allowedRoles={[Role.ShipOwner, Role.Administrator]}>
          <AppActionsSection children={buttons} />
        </AppGuard>
      </form>
    </CruiseFormProvider>
  );
}
