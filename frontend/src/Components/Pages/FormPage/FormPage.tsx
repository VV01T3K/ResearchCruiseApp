import React, {useEffect, useState} from "react";
import {FormValues} from "./Wrappers/FormTemplate";
import {useLocation} from "react-router-dom";
import FormA from "./Forms/FormA/FormA";
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

    return (
        <>
            {location.state?.formType == "A" && <FormA/>}
            {location.state?.formType == "B" && <FormB/>}
            {/*{location.state?.formType == "C" && <FormC/>}*/}
            {!location.state && <NotFoundPage/>}
        </>
    )
}


export default FormPage