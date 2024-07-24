import React, {useEffect, useState} from "react";
import {FormValues} from "./Wrappers/FormTemplate";
import useCustomEvent from "../../Tools/useCustomEvent";
import {useLocation} from "react-router-dom";
import FormA, {FormAValue, FormAValues} from "./Forms/FormA";
import FormB from "./Forms/FormB";
import FormC from "./Forms/FormC";
import Api from "../../Tools/Api";


export type FormPageLocationState = {
    formType: string,
    formId?: string,  // The id of the form to be loaded from the database if applicable
    localStorageValues?: FormValues, // To be deleted soon
    readonly: boolean
}


function FormPage(){
    // Get state from the navigation location. Navigating to this component is performed with
    // useNavigate (in LinkWithState component), not with the Link component
    const location = useLocation()
    const [locationState, _]
        = useState<FormPageLocationState | null>(location.state);

    // Set the values to be loaded to the form if applicable
    const [loadValues, setLoadValues]
        = useState<FormValues | undefined>()
    useEffect(() => {
        if (locationState?.formId) {
            console.log(locationState.formId)
            Api
                .get(
                    `/Forms/${locationState?.formId}`
                )
                .then(response => {
                    console.log(response)
                    setLoadValues(response.data)
                })
        }
        else {
            setLoadValues(locationState?.localStorageValues)
        }
    },[locationState]);

    return (
        <>
            {locationState?.formType == "A" &&
                <FormA
                    loadValues={loadValues}
                    readonly={locationState?.readonly}
                />
            }
            {locationState?.formType == "B" &&
                <FormB
                    loadValues={loadValues}
                    readonly={locationState?.readonly}
                />
            }
            {locationState?.formType == "C" &&
                <FormC
                    loadValues={loadValues}
                />
            }
        </>
    )
}


export default FormPage