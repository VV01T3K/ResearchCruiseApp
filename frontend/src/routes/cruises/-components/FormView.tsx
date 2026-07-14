import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppGuard } from '@/components/shared/AppGuard';
import { Role } from '@/types/user';
import { ApplicationsSection } from './ApplicationsSection';
import { BasicInformationSection } from './BasicInformationSection';
import { DateSelectionSection } from './DateSelectionSection';
import { ManagerSelectionSection } from './ManagerSelectionSection';
import { withForm } from '@/lib/form';
import { CruiseApplicationCandidate } from '@/routes/applications/$applicationId/-schemas/types/CruiseApplicationCandidate';
import { cruiseFormDefaultValues } from '@/routes/cruises/-schemas/form.schema';
import type { CruiseResponse } from '@/api/generated/schemas';

type Props = {
  cruise?: CruiseResponse;
  cruiseApplications: CruiseApplicationCandidate[];
  isReadonly: boolean;
  buttons: React.ReactNode;
};

export const FormView = withForm({
  defaultValues: cruiseFormDefaultValues,
  props: {} as Props,
  render: function Render({ form, cruise, cruiseApplications, isReadonly, buttons }) {
    return (
      <form.AppForm>
        <form
          className="space-y-8"
          onSubmit={(evt) => {
            evt.preventDefault();
            form.handleSubmit();
          }}
        >
          <BasicInformationSection form={form} cruise={cruise} isReadonly={isReadonly} />
          <DateSelectionSection form={form} isReadonly={isReadonly} />
          <ManagerSelectionSection
            form={form}
            cruise={cruise}
            cruiseApplications={cruiseApplications}
            isReadonly={isReadonly}
          />
          <ApplicationsSection form={form} cruiseApplications={cruiseApplications} isReadonly={isReadonly} />
          <AppGuard allowedRoles={[Role.ShipOwner, Role.Administrator]}>
            <AppActionsSection children={buttons} />
          </AppGuard>
        </form>
      </form.AppForm>
    );
  },
});
