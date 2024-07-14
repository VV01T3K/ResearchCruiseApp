import {Calendar, momentLocalizer} from "react-big-calendar";
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import 'moment/locale/pl';
import {Cruise} from "./CruisesPage";
import {useNavigate} from "react-router-dom";


type CalendarCruiseEvent = {
    start: Date,
    end: Date,
    title: string,
    fullCruise: Cruise
}

type Props = {
    cruises?: Cruise[]
}


export default function CruisesCalendar(props: Props) {
    const localizer = momentLocalizer(moment)
    const navigate = useNavigate()

    const [cruiseEvents, setCruiseEvents]
        = useState<CalendarCruiseEvent[] | undefined>()
    useEffect(() => {
        const newCruiseEvents: CalendarCruiseEvent[] | undefined = props.cruises?.map(cruise => ({
            start: new Date(cruise.date.start),
            end: new Date(cruise.date.end),
            title: `Kierownik: ${cruise.mainCruiseManagerFirstName} ${cruise.mainCruiseManagerLastName}`,
            fullCruise: cruise
        }))
        setCruiseEvents(newCruiseEvents)
    }, []);

    return (
        <Calendar
            localizer={localizer}
            culture={"pl"}
            events={cruiseEvents}
            startAccessor="start"
            endAccessor="end"
            className="p-2"
            views={["month", "week", "day"]}
            style={{
                height: "100vw",
                width: "70vw"
            }}
            messages={{
                month: "miesiąc",
                week: "tydzień",
                day: "dzień",
                today: "dzisiaj",
                previous: "🡸",
                next: "🡺"
            }}
            onSelectEvent={e => {
                navigate("/CruiseForm", {
                    state: { cruise: e.fullCruise }
                })
            }}
        />
    )
}
