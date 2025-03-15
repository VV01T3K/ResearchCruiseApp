import React from 'react';

import { AppCalendar } from '@/core/components/calendar/AppCalendar';
import { CruiseDto } from '@/cruise-schedule/models/CruiseDto';

type Props = {
  cruises: CruiseDto[];
  buttons: React.ReactNode[];
};
export function CruiseCalendar({ cruises, buttons }: Props) {
  const events = React.useMemo(
    () =>
      cruises.map((cruise) => ({
        title:
          cruise.mainCruiseManagerFirstName.length > 0
            ? `Kierownik: ${cruise.mainCruiseManagerFirstName} ${cruise.mainCruiseManagerLastName}`
            : 'Rejs bez kierownika',
        start: new Date(cruise.startDate),
        end: new Date(cruise.endDate),
        link: `/cruises/${cruise.id}`,
      })),
    [cruises]
  );

  return <AppCalendar events={events} buttons={(predefinedButtons) => [buttons, ...predefinedButtons]} />;
}
