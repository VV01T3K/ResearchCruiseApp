import React, {Dispatch, useState} from 'react';
import Page from "../Page";
import "react-big-calendar/lib/css/react-big-calendar.css"
import PageTitle from "../PageTitle";
import CruisesCalendar from "./CruisesCalendar";
import ReactSwitch from 'react-switch';
import CruisesList from "./CruisesList";
import {ApplicationShortInfo} from "../ApplicationsPage/ApplicationsPage";
import NewCruiseForm from "./NewCruiseForm";


export type Cruise = {
    id: string,
    number: string,
    startDate: string,
    endDate: string,
    applicationsShortInfo: ApplicationShortInfo[]
}

type Props = {
}


export default function CruisesPage(props: Props) {
    const [calendarView, setCalendarView] = useState(false)
    const [showNewCruiseForm, setShowNewCruiseForm] = useState(false)

    const generateCruises = () => {
        const records: Cruise[] = [];
        for (let i = 1; i <= 10; i++) {
            const record: Cruise = {
                id: (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString(),
                number: `2024/${i}`,
                startDate: `2024-${Math.floor(Math.random() * 2 + 10)}-${Math.floor(Math.random() * 10 + 20)}, ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
                endDate: `2024-${Math.floor(Math.random() * 2 + 10)}-${Math.floor(Math.random() * 10 + 20)}, ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
                applicationsShortInfo: [
                    {
                        id: (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString(),
                        number: `2024/${Math.floor(Math.random() * i)}`,
                        cruiseManagerFirstName: i % 3 == (Math.floor(Math.random() * 3)) ? "Sławomir" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Mieczysław" : "Trzebiesław"),
                        cruiseManagerLastName: i % 3 == (Math.floor(Math.random() * 3)) ? "Kiędonorski" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Adamczykowski" : "Sokołogonogonogonogonowski"),
                    },
                    {
                        id: (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString() + "-" + (Math.floor(Math.random() * 1000)).toString(),
                        number: `2024/${Math.floor(Math.random() * 2 * i)}`,
                        cruiseManagerFirstName: i % 3 == (Math.floor(Math.random() * 3)) ? "Sławomir" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Mieczysław" : "Trzebiesław"),
                        cruiseManagerLastName: i % 3 == (Math.floor(Math.random() * 3)) ? "Kiędonorski" : (i % 3 == (Math.floor(Math.random() * 3)) ? "Adamczykowski" : "Sokołogonogonogonogonowski"),
                    }
                ]
            };
            records.push(record);
        }
        return records;
    };

    const [cruises, setCruises]: [Cruise[], Dispatch<any>] = useState(generateCruises())

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <PageTitle title="Rejsy" />
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-y-scroll">
                    <div className="d-flex w-100 border-bottom border-dark-subtle"> {/* Menu bar */}
                        <div className="d-flex justify-content-start align-items-center w-50 p-3">
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
                        <div className="d-flex justify-content-end align-items-center w-50 p-3">
                            <button
                                className="btn btn-info w-50 p-2"
                                style={{ font: "inherit" }}
                                onClick={() => setShowNewCruiseForm(!showNewCruiseForm)}
                            >
                                Dodaj nowy rejs
                            </button>
                        </div>
                    </div> {/* Menu bar */}
                    {showNewCruiseForm && <NewCruiseForm />}
                    {calendarView && <CruisesCalendar cruises={cruises} />}
                    {!calendarView && <CruisesList cruises={cruises} />}
                </div>
            </div>
        </Page>
    )
}