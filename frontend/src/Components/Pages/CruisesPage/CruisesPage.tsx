import React, {useState} from 'react';
import Page from "../Page";
import "react-big-calendar/lib/css/react-big-calendar.css"
import PageTitle from "../PageTitle";
import CruisesCalendar from "./CruisesCalendar";
import ReactSwitch from 'react-switch';


export type Cruise = {
    id: string,
    number: string,
    startDate: string,
    endDate: string,

}

type Props = {
}


export default function CruisesPage(props: Props) {
    const [calendarView, setCalendarView] = useState(false)

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto">
                    <PageTitle title="Rejsy" />

                    <div className="d-flex justify-content-start align-items-center w-100 p-2">
                        <div className="d-flex pe-2">Widok listy</div>
                        <ReactSwitch
                                onColor="#0041d2"
                                offColor="#0041d2"
                                checked={calendarView}
                                checkedIcon={false}
                                uncheckedIcon={false}
                                onChange={() => { setCalendarView(!calendarView) }}
                            />
                        <div className="d-flex ps-2">Widok kalendarza</div>
                    </div>

                    {calendarView && <CruisesCalendar />}
                </div>
            </div>
        </Page>
    )
}