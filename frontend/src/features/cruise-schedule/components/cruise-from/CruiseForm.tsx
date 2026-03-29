import { AppActionsSection } from '@/components/AppActionsSection';
import { AppGuard } from '@/components/AppGuard';
import { Role } from '@/lib/models/Role';
import { CruiseFormApplicationsSection } from '@/features/cruise-schedule/components/cruise-from/CruiseFormApplications';
import { CruiseFormBasicInformationSection } from '@/features/cruise-schedule/components/cruise-from/CruiseFormBasicInformation';
import { CruiseFormDateSelectionSection } from '@/features/cruise-schedule/components/cruise-from/CruiseFormDateSelection';
import { CruiseFormManagerSelectionSection } from '@/features/cruise-schedule/components/cruise-from/CruiseFormManagerSelection';
import { CruiseFormProvider, CruiseFromContextType } from '@/features/cruise-schedule/contexts/CruiseFormContext';

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
