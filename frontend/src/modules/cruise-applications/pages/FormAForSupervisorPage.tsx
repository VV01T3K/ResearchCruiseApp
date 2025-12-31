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
import { CruisePeriodType, FormADto } from '@/cruise-applications/models/FormADto';

export function FormAForSupervisorPage() {
  const { cruiseApplicationId, supervisorCode } = getRouteApi('/cruiseapproval').useSearch();
  const navigate = useNavigate();
  const initialStateQuery = useFormAForSupervisorInitValuesQuery({ cruiseId: cruiseApplicationId, supervisorCode });
  const answerMutation = useSupervisorAnswerFormAMutation();
  const formA = useFormAForSupervisorQuery({ cruiseId: cruiseApplicationId, supervisorCode });

  const normalizePeriod = (period: unknown): CruisePeriodType | '' => {
    if (period === null || period === undefined) return '';
    if (Array.isArray(period) && period.length === 0) return '';
    if (Array.isArray(period) && period.length === 2) return period as CruisePeriodType;
    return '';
  };

  const form = useForm({
    defaultValues: (formA.data
      ? (() => {
          const normalizedAcceptable = normalizePeriod(formA.data.acceptablePeriod);
          const normalizedOptimal = normalizePeriod(formA.data.optimalPeriod);

          // Use stored periodSelectionType if available, otherwise infer from data
          // (for backwards compatibility with drafts that don't have this field)
          let periodSelectionType: 'precise' | 'period';
          if (formA.data.periodSelectionType === 'precise' || formA.data.periodSelectionType === 'period') {
            periodSelectionType = formA.data.periodSelectionType;
          } else {
            // Fallback: infer from data - if precise dates exist, use precise mode
            const hasPreciseDates = !!(formA.data.precisePeriodStart || formA.data.precisePeriodEnd);
            periodSelectionType = hasPreciseDates ? 'precise' : 'period';
          }

          return {
            ...formA.data,
            acceptablePeriod: normalizedAcceptable,
            optimalPeriod: normalizedOptimal,
            precisePeriodStart: formA.data.precisePeriodStart ?? '',
            precisePeriodEnd: formA.data.precisePeriodEnd ?? '',
            periodSelectionType,
          };
        })()
      : {
          id: undefined,
          cruiseManagerId: '',
          deputyManagerId: '',
          year: initialStateQuery.data.years[0],
          acceptablePeriod: ['0', '24'] as CruisePeriodType,
          optimalPeriod: ['0', '24'] as CruisePeriodType,
          precisePeriodStart: '',
          precisePeriodEnd: '',
          periodSelectionType: 'period' as const,
          cruiseHours: '0',
          periodNotes: '',
          shipUsage: '',
          differentUsage: '',
          permissions: [],
          researchAreaDescriptions: [],
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
        }) as FormADto,
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
