import {Calendar, momentLocalizer} from "react-big-calendar";
import React from "react";
import moment from "moment/moment";

type Props = {

}


export default function CruisesCalendar(props: Props) {
    const localizer = momentLocalizer(moment)

    return (
        <Calendar
            localizer={localizer}
            // events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
        />
    )
}
