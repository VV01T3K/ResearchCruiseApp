import React, {useContext, useState} from "react";
import {FormContext} from "../Pages/FormPage/Wrappers/FormTemplate";
import { handleSave} from "./FormButtonsHandlers";
import Api from "./Api";
import {CruiseApplicationContext} from "../Pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsPage";
import {CruiseApplicationStatus} from "../Pages/CruiseApplicationsPage/CruiseApplicationsPage";
import {useLocation, useNavigate} from "react-router-dom";
import {fetchCruiseApplications} from "./Fetchers";
import {Path} from "./Path";
import BusyEvent from "../CommonComponents/BusyEvent";
export const SaveButton = () => {
    const formContext = useContext(FormContext)
    const locationState = useLocation().state
    const navigate = useNavigate()
    const {setBusy} = BusyEvent()
    const handleAddCruise = () => Api
        .post(
            `/api/Cruises`,
            formContext!.getValues()
        )
        .then(_ =>
            navigate(Path.Cruises)
        )

    const handleEditCruise = () => {
        setBusy("Trwa zapisywanie")
        Api.patch(
            `/api/Cruises/${locationState.cruise!.id}`,
            formContext!.getValues())
            .then(_ =>
                navigate(Path.Cruises)
            )
    }

    return(
        <div onClick={ locationState.cruise ? formContext!.handleSubmit(handleEditCruise):
            formContext!.handleSubmit(handleAddCruise)} className="form-page-option-button w-100"> Zapisz rejs </div>
    )
}
export const ClearFormButton = () => {


    const formContext = useContext(FormContext)
    const locationState = useLocation().state

    const resetEditCruiseForm = () => {
        formContext!.reset()

        // if (locationState.cruise)
        //     fetchCruiseApplications(locationState.cruise.cruiseApplicationsShortInfo, setCruiseApplications)
    }
    return(
        <div onClick={ resetEditCruiseForm } className="form-page-option-button w-100"> {locationState.cruise ? "Cofnij zmiany" : "Wyczyść formularz"} </div>
    )
}


export const BottomOptionBar = () => (
    <div className="form-page-option-bar">
        <ClearFormButton/>
        <SaveButton/>
    </div>
)