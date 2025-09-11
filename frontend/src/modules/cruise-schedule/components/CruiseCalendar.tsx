import React from 'react';

import { AppCalendar } from '@/core/components/calendar/AppCalendar';
import { CruiseDto } from '@/cruise-schedule/models/CruiseDto';

type Props = {
  cruises: CruiseDto[];
  buttons: React.ReactNode[];
};
export function CruiseCalendar({ cruises, buttons }: Props) {
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

  const events = React.useMemo(
    () =>
      cruises.map((cruise) => ({
        title: getTitle(cruise),
        start: new Date(cruise.startDate),
        end: new Date(cruise.endDate),
        link: `/cruises/${cruise.id}`,
        color: cruise.shipUnavailable ? `#a10000` : getColor(getTitle(cruise)),
      })),
    [cruises]
  );

  return <AppCalendar events={events} buttons={(predefinedButtons) => [buttons, ...predefinedButtons]} />;
}
