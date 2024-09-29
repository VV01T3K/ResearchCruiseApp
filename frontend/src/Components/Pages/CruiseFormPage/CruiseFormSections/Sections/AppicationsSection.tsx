import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import React, {useContext, useEffect, useState} from "react";
import CruiseApplicationsList, {
    CruiseApplicationListMode
} from "../../../CruiseApplicationsPage/CruiseApplicationsList";
import {CruiseApplicationsContext} from "../../CruiseFormPage";
import {FieldValues, useFormContext} from "react-hook-form";
import {FormContext} from "../../../FormPage/Wrappers/FormTemplate";
import FieldWrapper from "../../../FormPage/Inputs/FieldWrapper";
import {FieldContext} from "../../../FormPage/Wrappers/FieldTableWrapper";

export const applicationsSectionFieldNames = {
    applicationsIds:"CruiseApplicationsIds",
}

const ToggleAddingModeButtons = () => {
    const [applicationsAddingMode, setApplicationsAddingMode] =
        useState(false)

    const EnableAddingModeButton = () => (
        <a className="cruises-button col-12" onClick={() => setApplicationsAddingMode(true)}>
            Dołącz zgłoszenie
        </a>
    )
    const DisableAddingModeButton = () => (
        <a className="cruises-button-outline-dark col-12"
           onClick={() => setApplicationsAddingMode(false)}>
            Anuluj dołączanie zgłoszenia
        </a>
    )
    return {applicationsAddingMode, EnableAddingModeButton, DisableAddingModeButton}
}
const render = ({field} : FieldValues) => {

    return(
        <FieldContext.Provider value={field}>
            <X/>
        </FieldContext.Provider>
    )
}

const X = () => {
    const {applicationsAddingMode, EnableAddingModeButton, DisableAddingModeButton} = ToggleAddingModeButtons()

    return(
        <>
            <CruiseApplicationsList mode={CruiseApplicationListMode.Deletion}/>
            { !applicationsAddingMode && <EnableAddingModeButton/> }
            { applicationsAddingMode &&
                <>
                    <DisableAddingModeButton/>
                    {applicationsAddingMode && <CruiseApplicationsList className={"mt-3"} mode={CruiseApplicationListMode.Add}/>}
                </>
            }
        </>
    )
}

const AddedApplicationsField = () => {
    const formContext = useContext(FormContext)
    const ApplicationsContext = useContext(CruiseApplicationsContext)
    useEffect(() => {
        if(ApplicationsContext?.cruiseApplications.length && formContext!.getValues(applicationsSectionFieldNames.applicationsIds) &&
            !formContext!.getValues(applicationsSectionFieldNames.applicationsIds).length )
            formContext?.reset()
    }, []);


    const fieldProps = {
        fieldName:applicationsSectionFieldNames.applicationsIds,
        render: render,
        rules: null,
        defaultValue: ApplicationsContext!.cruiseApplications.map(application=>application.id),
    }

    return  <FieldWrapper className={"w-100"} {...fieldProps}/>
}

export const ApplicationsSection = () => SectionWrapper(
    {
        shortTitle: "Zgłoszenia",
        longTitle: "Zgłoszenia przypisane do rejsu",
        children:
            <>
                <AddedApplicationsField/>
            </>

    }
)