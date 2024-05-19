import React, {useState, useEffect} from 'react';
import Page from "../Page";

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
const localizer = momentLocalizer(moment)

type Props = {
    className?: string
}

export default function SchedulePage(props: Props) {

    return (
        <>
                <Page className={props.className + " d-flex justify-content-center bg-white"}>
                    <Calendar
                        localizer={localizer}
                        // events={myEventsList}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                </Page>
        </>
    )
}