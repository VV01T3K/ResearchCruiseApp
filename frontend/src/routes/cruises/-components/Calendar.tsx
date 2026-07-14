import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { AppButton } from '@/components/shared/AppButton';
import { toast } from '@/components/shared/layout/toast';
import { AppCalendar } from '@/components/shared/calendar/AppCalendar';
import { getGetCruiseQueryKey, getGetCruisesQueryKey, useUpdateCruise } from '@/api/generated/endpoints/cruises.gen';
import type { CruiseResponse } from '@/api/generated/schemas';
import { getCruiseFormSchema, type CruiseFormValues } from '@/routes/cruises/-schemas/form.schema';

type Props = {
  cruises: CruiseResponse[];
  buttons: React.ReactNode[];
};
export function Calendar({ cruises, buttons }: Props) {
  const queryClient = useQueryClient();
  const updateCruiseByIdMutation = useUpdateCruise({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: getGetCruisesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetCruiseQueryKey(variables.cruiseId) });
      },
    },
  });
  const [isCalendarEditMode, setIsCalendarEditMode] = React.useState(false);

  function getTitle(cruise: CruiseResponse) {
    if (cruise.title || cruise.shipUnavailable) {
      return cruise.shipUnavailable ? `Blokada ${cruise.title}` : `Rejs ${cruise.title}`;
    }
    return cruise.mainManager.firstName.length > 0
      ? `Kierownik: ${cruise.mainManager.firstName} ${cruise.mainManager.lastName}`
      : 'Rejs bez kierownika';
  }

  function getColor(title: string) {
    let hash = 0;
    for (const char of title) {
      hash = (hash << 5) - hash + char.charCodeAt(0);
    }
    const angle = (hash % 45) + 225; // Shift to blue colors (180-270 degrees)
    return `hsl(${angle}deg 70% 50%)`;
  }

  function mapCruiseToForm(cruise: CruiseResponse, nextStart: Date, nextEnd: Date): CruiseFormValues {
    return {
      startDate: nextStart.toISOString(),
      endDate: nextEnd.toISOString(),
      managersTeam: {
        mainCruiseManagerId: cruise.mainManager.id,
        mainDeputyManagerId: cruise.deputyManager.id,
      },
      cruiseApplicationsIds: cruise.applications.map((x) => x.id),
      title: cruise.title || '',
      shipUnavailable: cruise.shipUnavailable,
    };
  }

  async function handleCruiseDrop(payload: { event: { id?: string }; nextStart: Date; nextEnd: Date }) {
    if (!payload.event.id) {
      return;
    }

    const cruise = cruises.find((item) => item.id === payload.event.id);
    if (!cruise) {
      return;
    }

    await updateCruiseByIdMutation.mutateAsync(
      {
        cruiseId: cruise.id,
        data: getCruiseFormSchema().parse(mapCruiseToForm(cruise, payload.nextStart, payload.nextEnd)),
      },
      {
        onSuccess: () => {
          toast.success('Termin rejsu został zmieniony.');
        },
        onError: () => {
          toast.error('Nie udało się zmienić terminu rejsu.');
        },
      }
    );
  }

  const events = React.useMemo(
    () =>
      cruises.map((cruise) => ({
        id: cruise.id,
        title: getTitle(cruise),
        start: new Date(cruise.startDate),
        end: new Date(cruise.endDate),
        link: `/cruises/${cruise.id}`,
        color: cruise.shipUnavailable ? `#a10000` : getColor(getTitle(cruise)),
      })),
    [cruises]
  );

  return (
    <AppCalendar
      events={events}
      buttons={(predefinedButtons) => [
        <AppButton
          key="calendar-edit-mode"
          variant={isCalendarEditMode ? 'primary' : 'primaryOutline'}
          onClick={() => setIsCalendarEditMode((prev) => !prev)}
        >
          {isCalendarEditMode ? 'Wyłącz tryb edycji kalendarza' : 'Włącz tryb edycji kalendarza'}
        </AppButton>,
        buttons,
        ...predefinedButtons,
      ]}
      onEventDrop={isCalendarEditMode ? handleCruiseDrop : undefined}
    />
  );
}
