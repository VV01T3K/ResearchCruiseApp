import { useForm } from '@tanstack/react-form';
import { getRouteApi } from '@tanstack/react-router';
import { Suspense, useState } from 'react';

import { AppLayout } from '@/core/components/AppLayout';
import { AppLoader } from '@/core/components/AppLoader';
import { FormA } from '@/cruise-applications/components/formA/FormA';
import { getFormAValidationSchema } from '@/cruise-applications/helpers/FormAValidationSchema';
import { useFormAInitValuesQuery, useFormAQuery } from '@/cruise-applications/hooks/FormAApiHooks';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { useUserContext } from '@/user/hooks/UserContextHook';

export function FormAPage() {
  const userContext = useUserContext();
  const [editMode] = useState(false);
  const [hasFormBeenSubmitted, setHasFormBeenSubmitted] = useState(false);
  const { cruiseId } = getRouteApi('/cruises/$cruiseId/formA').useParams();
  const initialStateQuery = useFormAInitValuesQuery();
  const formA = useFormAQuery(cruiseId);

  const form = useForm<FormADto>({
    defaultValues: formA.data ?? {
      id: undefined,
      cruiseManagerId: userContext.currentUser!.id,
      deputyManagerId: '',
      year: initialStateQuery.data.years[0],
      acceptablePeriod: ['0', '24'],
      optimalPeriod: ['0', '24'],
      cruiseHours: '0',
      periodNotes: '',
      shipUsage: '',
      differentUsage: '',
      permissions: [],
      researchAreaId: '',
      researchAreaInfo: '',
      cruiseGoal: '',
      cruiseGoalDescription: '',
      researchTasks: [],
      contracts: [],
      ugTeams: [],
      guestTeams: [],
      publications: [],
      spubTasks: [],
      supervisorEmail: '',
      note: '',
    },
    validators: {
      onChange: getFormAValidationSchema(initialStateQuery.data),
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    evt.stopPropagation();
    setHasFormBeenSubmitted(true);
    form.handleSubmit();
  }

  return (
    <AppLayout title="Formularz A" variant="defaultWithoutCentering">
      <Suspense fallback={<AppLoader />}>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <FormA context={{ form, initValues: initialStateQuery.data, isReadonly: !editMode, hasFormBeenSubmitted }} />
        </form>
      </Suspense>
    </AppLayout>
  );
}
