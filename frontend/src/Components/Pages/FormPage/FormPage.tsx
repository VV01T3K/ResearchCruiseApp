import React, {useEffect, useState} from "react";
import {FormValues} from "./Wrappers/FormTemplate";
import {useLocation} from "react-router-dom";
import FormA from "./Forms/FormA";
import FormB from "./Forms/FormB";
import FormC from "./Forms/FormC";
import Api from "../../Tools/Api";
import NotFoundPage from "../NotFoundPage";


export type FormPageLocationState = {
    formType: string,
    cruiseApplicationId?: string,  // The id of the form to be loaded from the database if applicable
    localStorageValues?: FormValues, // To be deleted soon
    readonly?: boolean
}


function FormPage(){
    const location = useLocation()
    const [locationState, _] = useState<FormPageLocationState | null>(location.state);

    const [loadValues, setLoadValues]
        = useState<FormValues | undefined>()
    useEffect(() => {
        if (locationState?.cruiseApplicationId) {
            console.log(locationState.cruiseApplicationId)
            Api
                .get(`/api/CruiseApplications/${locationState?.cruiseApplicationId}/form${locationState.formType}`)
                .then(response => {
                    console.log(response)
                    setLoadValues(response?.data)
                })
        }
    },[locationState]);

    return (
        <>
            {locationState?.formType == "A" &&
                <FormA loadValues={loadValues} readonly={locationState?.readonly}/>}
            {locationState?.formType == "B" &&
                <FormB loadValues={loadValues} readonly={locationState?.readonly}/>}
            {locationState?.formType == "C" &&
                <FormC loadValues={loadValues} readonly={locationState?.readonly}/>}
            {!locationState && <NotFoundPage/>}
        </>
    )
}


export default FormPage