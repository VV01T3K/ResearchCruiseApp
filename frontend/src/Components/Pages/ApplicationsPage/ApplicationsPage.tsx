import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Page from "../Page";
import Api from "../../Tools/Api";
import DataTable from 'react-data-table-component';
import useCustomEvent from "../../Tools/useCustomEvent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import PageTitle from "../CommonComponents/PageTitle";
import LinkWithState from "../../CommonComponents/LinkWithState";
import ApplicationsList from "./ApplicationsList";


export type ApplicationShortInfo = {
    id: string,
    number: string,
    points: number
}

export type Application = {
    id: string,
    number: string,
    date: string,
    year: number,
    cruiseManagerFirstName: string,
    cruiseManagerLastName: string,
    deputyManagerFirstName: string,
    deputyManagerLastName: string,
    formAId: string | null,
    formBId: string | null,
    formCId: string | null,
    status: string,
    points: string,
    pointsDetails: any
}


function ApplicationsPage() {

    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto">
                    <PageTitle title="Zgłoszenia" />
                    <ApplicationsList />
                </div>
            </div>
        </Page>
    )
}


export default ApplicationsPage