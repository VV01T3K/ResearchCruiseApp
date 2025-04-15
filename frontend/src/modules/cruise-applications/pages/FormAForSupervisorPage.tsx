import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import axios, { AxiosError } from 'axios';

import { useAppContext } from '@/core/hooks/AppContextHook';
import { FormAForSupervisor } from '@/cruise-applications/components/formA/FormAForSupervisor';
import {
  useFormAForSupervisorInitValuesQuery,
  useFormAForSupervisorQuery,
  useSupervisorAnswerFormAMutation,
} from '@/cruise-applications/hooks/FormAApiHooks';
import { FormADto } from '@/cruise-applications/models/FormADto';

export function FormAForSupervisorPage() {
  const { cruiseApplicationId, supervisorCode } = getRouteApi('/cruiseapproval').useSearch();
  const navigate = useNavigate();
  const appContext = useAppContext();
  const initialStateQuery = useFormAForSupervisorInitValuesQuery({ cruiseId: cruiseApplicationId, supervisorCode });
  const answerMutation = useSupervisorAnswerFormAMutation();
  const formA = useFormAForSupervisorQuery({ cruiseId: cruiseApplicationId, supervisorCode });

  const form = useForm<FormADto>({
    defaultValues: formA.data ?? {
      id: undefined,
      cruiseManagerId: '',
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
  });

  function handleAcceptForm() {
    answerMutation.mutate(
      { id: cruiseApplicationId!, accept: true, supervisorCode: supervisorCode! },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          appContext.showAlert({
            title: 'Zaakceptowano zgłoszenie',
            message: 'Zgłoszenie zostało zaakceptowane',
            variant: 'success',
          });
        },
        onError: (err: Error | AxiosError) => {
          console.error(err);
          if (axios.isAxiosError(err) && err.response?.status === 403) {
            appContext.showAlert({
              title: 'Niedozwolona operacja',
              message: err.response?.data,
              variant: 'danger',
            });
          } else {
            appContext.showAlert({
              title: 'Wystąpił błąd',
              message: 'Nie udało się zaakceptować zgłoszenia',
              variant: 'danger',
            });
          }
        },
      }
    );
  }

  function handleDenyForm() {
    answerMutation.mutate(
      { id: cruiseApplicationId!, accept: false, supervisorCode: supervisorCode! },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          appContext.showAlert({
            title: 'Odrzucono zgłoszenie',
            message: 'Zgłoszenie zostało odrzucone',
            variant: 'success',
          });
        },
        onError: (err: Error | AxiosError) => {
          console.error(err);
          if (axios.isAxiosError(err) && err.response?.status === 403) {
            appContext.showAlert({
              title: 'Niedozwolona operacja',
              message: err.response?.data,
              variant: 'danger',
            });
          } else {
            appContext.showAlert({
              title: 'Wystąpił błąd',
              message: 'Nie udało się odrzucić zgłoszenia',
              variant: 'danger',
            });
          }
        },
      }
    );
  }

  return (
    <FormAForSupervisor
      form={form}
      formInitValues={initialStateQuery.data}
      handleAcceptForm={handleAcceptForm}
      handleDenyForm={handleDenyForm}
    />
  );
}
