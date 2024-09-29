import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import React, {useContext, useEffect, useState} from "react";
import CruiseApplicationsList, {
    CruiseApplicationListMode
} from "../../../CruiseApplicationsPage/CruiseApplicationsList";
import {FieldValues} from "react-hook-form";
import {FormContext} from "../../../FormPage/Wrappers/FormTemplate";
import FieldWrapper from "../../../FormPage/Inputs/FieldWrapper";
import {FieldContext} from "../../../FormPage/Wrappers/FieldTableWrapper";
import {extendedUseLocation} from "../../../FormPage/FormPage";
import {fetchCruiseApplications} from "../../../../Tools/Fetchers";
import {CruiseApplication} from "../../../CruiseApplicationsPage/CruiseApplicationsPage";

export const applicationsSectionFieldNames = {
    applicationsIds:"cruiseApplicationsIds",
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
        <a className="cruises-button-outline-dark col-12" onClick={() => setApplicationsAddingMode(false)}>
            Anuluj dołączanie zgłoszenia
        </a>
    )
    return {applicationsAddingMode, EnableAddingModeButton, DisableAddingModeButton}
}

//temporary -> rerenders need fix
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

    const location = extendedUseLocation()

    const [cruiseApplications, setCruiseApplications] = useState<CruiseApplication[]>([])
    useEffect(() => {
        if (location?.state?.cruise)
            (fetchCruiseApplications)(location.state.cruise.cruiseApplicationsShortInfo, setCruiseApplications)
    }, []);

    const fieldProps = {
        fieldName:applicationsSectionFieldNames.applicationsIds,
        render: render,
        rules: null,
       defaultValue: cruiseApplications.map(application=>application.id),
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