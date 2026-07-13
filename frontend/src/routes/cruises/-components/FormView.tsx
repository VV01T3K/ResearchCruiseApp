import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppGuard } from '@/components/shared/AppGuard';
import { Role } from '@/models/shared/Role';
import { ApplicationsSection } from './ApplicationsSection';
import { BasicInformationSection } from './BasicInformationSection';
import { DateSelectionSection } from './DateSelectionSection';
import { ManagerSelectionSection } from './ManagerSelectionSection';
import { CruiseFormProvider, CruiseFormContextType } from '@/contexts/cruises/CruiseFormContext';

type Props = {
  context: CruiseFormContextType;
  buttons: React.ReactNode;

  onSubmit?: () => void;
};

export function FormView({ context, buttons, onSubmit }: Props) {
  return (
    <CruiseFormProvider value={context}>
      <form
        className="space-y-8"
        onSubmit={(evt) => {
          evt.preventDefault();
          onSubmit?.();
        }}
      >
        <BasicInformationSection />
        <DateSelectionSection />
        <ManagerSelectionSection />
        <ApplicationsSection />
        <AppGuard allowedRoles={[Role.ShipOwner, Role.Administrator]}>
          <AppActionsSection children={buttons} />
        </AppGuard>
      </form>
    </CruiseFormProvider>
  );
}
