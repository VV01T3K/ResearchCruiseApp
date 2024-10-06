import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import React, {useContext, useEffect, useState} from "react";
import CruiseApplicationsList, {
    ApplicationsContext,
    CruiseApplicationListMode
} from "../../../CruiseApplicationsPage/CruiseApplicationsList";
import {FieldValues} from "react-hook-form";
import {FormContext} from "../../../FormPage/Wrappers/FormTemplate";
import FieldWrapper from "../../../FormPage/Inputs/FieldWrapper";
import {FieldContext} from "../../../FormPage/Wrappers/FieldTableWrapper";
import {extendedUseLocation} from "../../../FormPage/FormPage";
import {fetchCruiseApplications} from "../../../../Tools/Fetchers";
import {CruiseApplication} from "../../../CruiseApplicationsPage/CruiseApplicationsPage";
import UserBasedAccess from "../../../../UserBasedAccess";
import Api from "../../../../Tools/Api";
import {CruiseApplicationsContext} from "../../CruiseFormPage";

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
    const formContext = useContext(FormContext)
    return(
        <>
            <CruiseApplicationsList mode={CruiseApplicationListMode.Deletion}/>
            { !formContext?.readOnly &&
                <>
                    { !applicationsAddingMode && <EnableAddingModeButton/> }
                    { applicationsAddingMode &&
                        <>
                            <DisableAddingModeButton/>
                            <CruiseApplicationsList className={"mt-3"} mode={CruiseApplicationListMode.Add}/>
                        </>
                    }
                </>
            }
        </>
    )
}

const AddedApplicationsField = () => {

    const location = extendedUseLocation()

    const [cruiseApplications, setCruiseApplications] = useState<CruiseApplication[]>([])
    useEffect(() => {
        if (location?.state?.cruise || cruiseApplications.length<=0)
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

export const ApplicationsSection = () => {
    const {UserHasShipownerAccess,UserHasAdminAccess} = UserBasedAccess()

    const [fetchedCruiseApplications, setFetchedCruiseApplications] = useState([])
    useEffect(() => {
        if(fetchedCruiseApplications.length<=0){
            Api.get('/api/CruiseApplications').then(response =>
                setFetchedCruiseApplications(response?.data))
        }

    }, []);

    return SectionWrapper(
        {
            shortTitle: "Zgłoszenia",
            longTitle: (UserHasShipownerAccess() || UserHasAdminAccess()) ? "Zgłoszenia przypisane do rejsu": "Moje zgłoszenia przypisane do rejsu",
            children:
                <CruiseApplicationsContext.Provider value={fetchedCruiseApplications}>
                    <AddedApplicationsField/>
                </CruiseApplicationsContext.Provider>

        }
    )
}