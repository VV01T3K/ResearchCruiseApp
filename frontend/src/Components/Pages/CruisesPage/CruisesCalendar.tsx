import {Calendar, momentLocalizer} from "react-big-calendar";
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import {Cruise} from "./CruisesPage";


type CalendarCruiseEvent = {
    start: Date,
    end: Date,
    title: string
}

type Props = {
    cruises?: Cruise[]
}


export default function CruisesCalendar(props: Props) {
    const localizer = momentLocalizer(moment)

    const [cruiseEvents, setCruiseEvents]
        = useState<CalendarCruiseEvent[] | undefined>()
    useEffect(() => {
        const newCruiseEvents: CalendarCruiseEvent[] | undefined = props.cruises?.map(cruise => ({
            start: new Date(cruise.date.start),
            end: new Date(cruise.date.end),
            title: `${cruise.mainCruiseManagerFirstName} ${cruise.mainCruiseManagerLastName}`
        }))
        setCruiseEvents(newCruiseEvents)
        console.log(cruiseEvents)
    }, []);

    return (
        <Calendar
            localizer={localizer}
            events={cruiseEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
        />
    )
}
