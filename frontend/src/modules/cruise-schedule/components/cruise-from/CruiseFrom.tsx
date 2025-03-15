import { AppActionsSection } from '@/core/components/AppActionsSection';
import { CruiseFormApplicationsSection } from '@/cruise-schedule/components/cruise-from/CruiseFormApplications';
import { CruiseFormBasicInformationSection } from '@/cruise-schedule/components/cruise-from/CruiseFormBasicInformation';
import { CruiseFormDateSelectionSection } from '@/cruise-schedule/components/cruise-from/CruiseFormDateSelection';
import { CruiseFormManagerSelectionSection } from '@/cruise-schedule/components/cruise-from/CruiseFormManagerSelection';
import { CruiseFormProvider, CruiseFromContextType } from '@/cruise-schedule/contexts/CruiseFormContext';

type Props = {
  context: CruiseFromContextType;
  buttons: React.ReactNode;
};

export function CruiseFrom({ context, buttons }: Props) {
  return (
    <CruiseFormProvider value={context}>
      <CruiseFormBasicInformationSection />
      <CruiseFormDateSelectionSection />
      <CruiseFormManagerSelectionSection />
      <CruiseFormApplicationsSection />
      <AppActionsSection children={buttons} />
    </CruiseFormProvider>
  );
}
