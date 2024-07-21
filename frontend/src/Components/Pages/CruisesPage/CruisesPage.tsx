import React, {Dispatch, useEffect, useState} from 'react';
import Page from "../Page";
import "react-big-calendar/lib/css/react-big-calendar.css"
import PageTitle from "../CommonComponents/PageTitle";
import CruisesCalendar from "./CruisesCalendar";
import ReactSwitch from 'react-switch';
import CruisesList from "./CruisesList";
import {ApplicationShortInfo} from "../ApplicationsPage/ApplicationsPage";
import Api from "../../Tools/Api";
import {Time} from "../FormPage/Inputs/TaskInput/TaskInput";
import LinkWithState from "../../CommonComponents/LinkWithState";
import PageMenuBar from "../CommonComponents/PageMenuBar";


export type Cruise = {
    id: string,
    number: string,
    date: Time,
    mainCruiseManagerId: string,
    mainCruiseManagerFirstName: string,
    mainCruiseManagerLastName: string,
    mainDeputyManagerId: string,
    applicationsShortInfo: ApplicationShortInfo[]
}


export default function CruisesPage() {
    const [listView, setListView] = useState(true)

    const fetchCruises = () => {
        Api
            .get('/api/Cruises',)
            .then(response =>
                setCruises(response.data)
            )
    }

    const autoAddCruises = () => {
        Api
            .put('/api/Cruises/autoAdded')
            .then(response =>
                fetchCruises()
            )
    }

    const [cruises, setCruises] = useState<Cruise[]>([])
    useEffect(() => {
        fetchCruises()
    },[]);

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <PageTitle title="Rejsy" />
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-y-scroll">
                    <PageMenuBar>
                        <div className="d-flex justify-content-start align-items-center w-50 p-3">
                            <div className="d-flex pe-2">Widok kalendarza</div>
                            <ReactSwitch
                                    onColor="#0041d2"
                                    offColor="#0041d2"
                                    checked={listView}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    onChange={() => { setListView(!listView) }}
                                />
                            <div className="d-flex ps-2">Widok listy</div>
                        </div>
                        <div className="d-flex flex-wrap justify-content-end align-items-center w-50 p-3">
                            <div className="d-flex justify-content-end align-items-center w-100 mb-1">
                                <button
                                    className="btn btn-info w-50 p-2"
                                    style={{ font: "inherit" }}
                                    onClick={autoAddCruises}
                                >
                                    Dodaj rejsy automatycznie
                                </button>
                            </div>
                            <div className="d-flex justify-content-end align-items-center w-100">
                                <LinkWithState
                                    className="btn btn-info w-50 p-2"
                                    to="/CruiseForm"
                                    label="Dodaj nowy rejs"
                                    state={{ }}
                                />
                            </div>
                        </div>
                    </PageMenuBar>
                    {!listView && <CruisesCalendar cruises={cruises} />}
                    {listView && <CruisesList cruises={cruises} setCruises={setCruises} />}
                </div>
            </div>
        </Page>
    )
}