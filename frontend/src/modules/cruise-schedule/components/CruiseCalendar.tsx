import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { toast } from '@/core/components/layout/toast';
import { AppCalendar } from '@/core/components/calendar/AppCalendar';
import { useUpdateCruiseByIdMutation } from '@/cruise-schedule/hooks/CruisesApiHooks';
import { CruiseDto } from '@/cruise-schedule/models/CruiseDto';
import { CruiseFormDto } from '@/cruise-schedule/models/CruiseFormDto';

type Props = {
  cruises: CruiseDto[];
  buttons: React.ReactNode[];
};
export function CruiseCalendar({ cruises, buttons }: Props) {
  const updateCruiseByIdMutation = useUpdateCruiseByIdMutation();
  const [isCalendarEditMode, setIsCalendarEditMode] = React.useState(false);

  function getTitle(cruise: CruiseDto) {
    if (cruise.title || cruise.shipUnavailable) {
      return cruise.shipUnavailable ? `Blokada ${cruise.title}` : `Rejs ${cruise.title}`;
    }
    return cruise.mainCruiseManagerFirstName.length > 0
      ? `Kierownik: ${cruise.mainCruiseManagerFirstName} ${cruise.mainCruiseManagerLastName}`
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

  function mapCruiseToForm(cruise: CruiseDto, nextStart: Date, nextEnd: Date): CruiseFormDto {
    return {
      startDate: nextStart.toISOString(),
      endDate: nextEnd.toISOString(),
      managersTeam: {
        mainCruiseManagerId: cruise.mainCruiseManagerId,
        mainDeputyManagerId: cruise.mainDeputyManagerId,
      },
      cruiseApplicationsIds: cruise.cruiseApplicationsShortInfo.map((x) => x.id),
      status: cruise.status,
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
        id: cruise.id,
        cruise: mapCruiseToForm(cruise, payload.nextStart, payload.nextEnd),
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
