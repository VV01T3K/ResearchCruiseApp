import React, {useEffect} from "react";
import {FormValues} from "./Wrappers/FormTemplate";
import {useLocation, useNavigate} from "react-router-dom";
import FormA from "./Forms/FormA/FormA";
import FormB from "./Forms/FormB";
import NotFoundPage from "../NotFoundPage";
import {Buffer} from 'buffer';
import {Path} from "../../Tools/Path";

export type FormPageLocationState = {
    formType: string,
    cruiseApplicationId?: string,  // The id of the form to be loaded from the database if applicable
    localStorageValues?: FormValues, // To be deleted soon
    readonly?: boolean
}

export const extendedUseLocation = () => {
    const location = useLocation()
    if(location.state)
        return location

    const queryParams = new URLSearchParams(window.location.search);
    const dataParam = queryParams.get('data');
    if(dataParam){
        try{
            const stateJSON = Buffer.from(dataParam, "base64").toString()
            const state = JSON.parse(stateJSON)
            return {state:state}
        }
        catch (e){
            return undefined
        }
    }
    return undefined

}

function FormPage(){
    const location = extendedUseLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if(!location?.state)
            navigate(Path.Default)
    }, []);

    return (
        <>
            {location?.state?.formType == "A" && <FormA/>}
            {location?.state?.formType == "B" && <FormB/>}
            {/*{location.state?.formType == "C" && <FormC/>}*/}
            {!location?.state && <NotFoundPage/>}
        </>
    )
}


export default FormPage