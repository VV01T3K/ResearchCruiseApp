import React, {Dispatch, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import FormTemplate, {FormValues} from "./Wrappers/FormTemplate";
import PageTitleWithNavigation from "../CommonComponents/PageTitleWithNavigation";
import FormUserSelect from "./Inputs/FormUserSelect";
import FormSection from "./Wrappers/FormSection";
import MonthSlider from "./Inputs/MonthSlider";
import NumberInput from "./Inputs/NumberInput";
import TextArea from "./Inputs/TextArea";
import FormRadio from "./Inputs/FormRadio";
import ClickableMap from "./Inputs/ClickableMap";
import TaskInput, {Task} from "./Inputs/TaskInput/TaskInput";
import GuestTeamsInput, {GuestsTeam} from "./Inputs/GuestTeamsInput/GuestTeamsInput";
import SpubTasksInput, {SpubTask} from "./Inputs/SpubTasksInput";
import {DummyTag} from "../../Tools/DummyTag";
import FormWithSections from "./Wrappers/FormWithSections";
import ContractsInput, {Contract} from "./Inputs/ContractsInput/ContractsInput";
import UgTeamsInput, {UgTeam} from "./Inputs/UgTeamsInput/UgTeamsInput";
import {administrationUnits} from "../../../resources/administrationUnits";
import useCustomEvent from "../../Tools/useCustomEvent";
import api from "../../Tools/Api";
import FormYearSelect from "./Inputs/FormYearSelect";
import ThesisInput from "./Inputs/ThesisInput/ThesisInput"
import PublicationsInput from "./Inputs/PublicationsInput/PublicationsInput";
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

    const { dispatchEvent } = useCustomEvent('busy')

    // Set the values to be loaded to the form if applicable
    const [loadValues, setLoadValues]
        = useState<FormValues | undefined>()
    useEffect(() => {
        if (locationState?.formId) {
            Api
                .get(
                    `/Forms/${locationState?.formId}`
                )
                .then(response => {
                        setLoadValues(response.data)
                    }
                )
                .catch(error =>
                    console.log(error)
                )
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