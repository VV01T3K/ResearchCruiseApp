import { Calendar, momentLocalizer } from 'react-big-calendar';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment/moment';
import 'moment/locale/pl';
import { CruiseStateContext } from './CruisesPage';
import { useNavigate } from 'react-router-dom';
import { Cruise } from 'Cruise';
import { EMPTY_GUID } from '@consts/emptyGuid';

type CalendarCruiseEvent = {
    start: Date;
    end: Date;
    title: string;
    fullCruise: Cruise;
};

type Props = {
    cruises?: Cruise[];
};

export default function CruisesCalendar(props: Props) {
    const localizer = momentLocalizer(moment);
    const navigate = useNavigate();
    const cruisesStateContext = useContext(CruiseStateContext);

    const [cruiseEvents, setCruiseEvents] = useState<
        CalendarCruiseEvent[] | undefined
    >();
    useEffect(() => {
        const newCruiseEvents: CalendarCruiseEvent[] | undefined =
            cruisesStateContext!.cruises?.map((cruise) => ({
                start: new Date(cruise.startDate),
                end: new Date(cruise.endDate),
                title:
                    cruise.mainCruiseManagerId != EMPTY_GUID
                        ? `Kierownik: ${cruise.mainCruiseManagerFirstName} ${cruise.mainCruiseManagerLastName}`
                        : 'Rejs bez kierownika',
                fullCruise: cruise,
            }));
        setCruiseEvents(newCruiseEvents);
    }, []);

    return (
        <div className={'calendar-container'}>
            <Calendar
                localizer={localizer}
                culture={'pl'}
                events={cruiseEvents}
                startAccessor="start"
                className="calendar"
                endAccessor="end"
                views={{ month: true, week: true }}
                messages={{
                    month: 'miesiąc',
                    week: 'tydzień',
                    day: 'dzień',
                    today: 'dzisiaj',
                    previous: '🡸',
                    next: '🡺',
                }}
                onSelectEvent={(e: CalendarCruiseEvent) => {
                    navigate('/CruiseForm', {
                        state: { cruise: e.fullCruise },
                    });
                }}
            />
        </div>
    );
}
