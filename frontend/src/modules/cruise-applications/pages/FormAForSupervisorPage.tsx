import { useForm } from '@tanstack/react-form';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

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
    const loading = toast.loading('Przetwarzanie zgłoszenia...');
    answerMutation.mutate(
      { id: cruiseApplicationId!, accept: true, supervisorCode: supervisorCode! },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success('Zgłoszenie zostało zaakceptowane');
        },
        onError: (err: Error | AxiosError) => {
          console.error(err);
          if (axios.isAxiosError(err) && err.response?.status === 403) {
            toast.error('Niedozwolona operacja: ' + err.response?.data);
          } else {
            toast.error('Wystąpił błąd: Nie udało się zaakceptować zgłoszenia');
          }
        },
        onSettled: () => {
          toast.dismiss(loading);
        },
      }
    );
  }

  function handleDenyForm() {
    const loading = toast.loading('Przetwarzanie zgłoszenia...');
    answerMutation.mutate(
      { id: cruiseApplicationId!, accept: false, supervisorCode: supervisorCode! },
      {
        onSuccess: () => {
          navigate({ to: '/' });
          toast.success('Zgłoszenie zostało odrzucone');
        },
        onError: (err: Error | AxiosError) => {
          console.error(err);
          if (axios.isAxiosError(err) && err.response?.status === 403) {
            toast.error('Niedozwolona operacja: ' + err.response?.data);
          } else {
            toast.error('Wystąpił błąd: Nie udało się odrzucić zgłoszenia');
          }
        },
        onSettled: () => {
          toast.dismiss(loading);
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
