import { ReactFormExtendedApi } from '@tanstack/react-form';
import { Suspense } from 'react';

import { AppLayout } from '@/core/components/AppLayout';
import { AppLoader } from '@/core/components/AppLoader';
import { FormAContractsSection } from '@/cruise-applications/components/formA/FormAContractsSection';
import { FormACruiseGoalSection } from '@/cruise-applications/components/formA/FormACruiseGoalSection';
import { FormACruiseLengthSection } from '@/cruise-applications/components/formA/FormACruiseLengthSection';
import { FormACruiseManagerInfoSection } from '@/cruise-applications/components/formA/FormACruiseManagerInfoSection';
import { FormAForSupervisorActionsSection } from '@/cruise-applications/components/formA/FormAForSupervisorActionsSection';
import { FormAMembersSection } from '@/cruise-applications/components/formA/FormAMembersSection';
import { FormAPermissionsSection } from '@/cruise-applications/components/formA/FormAPermissionsSection';
import { FormAPublicationsSection } from '@/cruise-applications/components/formA/FormAPublicationsSection';
import { FormAResearchAreaSection } from '@/cruise-applications/components/formA/FormAResearchAreaSection';
import { FormAResearchTasksSection } from '@/cruise-applications/components/formA/FormAResearchTasksSection';
import { FormASPUBTasksSection } from '@/cruise-applications/components/formA/FormASPUBTasksSection';
import { FormASupervisorInfoSection } from '@/cruise-applications/components/formA/FormASupervisorInfoSection';
import { FormAProvider } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';

export function FormAForSupervisor({
  form,
  formInitValues,
  handleAcceptForm,
  handleDenyForm,
}: {
  form: ReactFormExtendedApi<FormADto, undefined>;
  formInitValues: FormAInitValuesDto;
  handleAcceptForm: () => void;
  handleDenyForm: () => void;
}) {
  return (
    <AppLayout title="Formularz A">
      <Suspense fallback={<AppLoader />}>
        <div className="space-y-8">
          <FormAProvider value={{ form, initValues: formInitValues, isReadonly: true, hasFormBeenSubmitted: false }}>
            <FormACruiseManagerInfoSection />
            <FormACruiseLengthSection />
            <FormAPermissionsSection />
            <FormAResearchAreaSection />
            <FormACruiseGoalSection />
            <FormAResearchTasksSection />
            <FormAContractsSection />
            <FormAMembersSection />
            <FormAPublicationsSection />
            <FormASPUBTasksSection />
            <FormASupervisorInfoSection />
            <FormAForSupervisorActionsSection onAccept={handleAcceptForm} onDeny={handleDenyForm} />
          </FormAProvider>
        </div>
      </Suspense>
    </AppLayout>
  );
}
