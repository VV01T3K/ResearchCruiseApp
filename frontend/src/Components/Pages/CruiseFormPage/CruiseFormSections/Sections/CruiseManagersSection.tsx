import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import UserSelect, {FormUser} from "../../../FormPage/Inputs/UserSelect";
import React, {useContext, useEffect, useState} from "react";
import {FormContext, WatchContext} from "../../../FormPage/Wrappers/FormTemplate";
import {ErrorMessageIfPresentNoContext} from "../../../CommonComponents/ErrorMessageIfPresent";
import {ApplicationToCruiseManagersMapper} from "../CruiseListMisc";
import {applicationsSectionFieldNames} from "./AppicationsSection";
import {CruiseApplication} from "../../../CruiseApplicationsPage/CruiseApplicationsPage";
import Api from "../../../../Tools/Api";
import app from "../../../../App";
import {useWatch} from "react-hook-form";
import {ApplicationsContext} from "../../../CruiseApplicationsPage/CruiseApplicationsList";
import {extendedUseLocation} from "../../../FormPage/FormPage";
import {EMPTY_GUID} from "../../CruiseFormPage";

export const cruiseManagerSectionFieldNames = {
    mainCruiseManagerId:"managersTeam.mainCruiseManagerId",
    mainDeputyManagerId:"managersTeam.mainDeputyManagerId",
}

const getUsersFromCruiseApplications = (): FormUser[] => {
    const formContext = useContext(FormContext)
    const applicationsContext = useContext(ApplicationsContext)

    const val = useWatch({control:formContext!.control,name:applicationsSectionFieldNames.applicationsIds, exact:true})

    const usersPairs =  applicationsContext.filter(app=>val.includes(app.id))
        .map(ApplicationToCruiseManagersMapper)


    // leave only unique values
    return usersPairs?.flat().filter((value, index, array) =>
        // look at the id only to determine the uniqueness,
        array.map(user => user.id)
            // leave only the first occurrence of the given user
       .indexOf(value.id) === index)
}

const CruiseManagersField = () => {
    const formContext = useContext(FormContext)
    const mainManagerField = formContext!.getValues(cruiseManagerSectionFieldNames.mainCruiseManagerId)
    const location = extendedUseLocation()
    const deputyManagerField = formContext!.getValues(cruiseManagerSectionFieldNames.mainDeputyManagerId)
    const cruiseUsers = getUsersFromCruiseApplications()
    const errorString = "mainCruiseManagerIsTheSameAsMainDeputyManager"
    const error =  formContext?.formState.errors[errorString]


    useEffect(() => {
        const areFieldsEqual = (mainManagerField) && (mainManagerField != EMPTY_GUID) && mainManagerField == deputyManagerField

        if(areFieldsEqual && !error)
            formContext!.setError(errorString, {type:"custom",message:"Kierownik i jego zastępca muszą być innymi osobami"})
        else if(!areFieldsEqual && error)
            formContext!.clearErrors(errorString)

    }, []);



    if(cruiseUsers.map(user=>user.id).includes(location?.state.cruise.mainCruiseManagerId)  && (mainManagerField == EMPTY_GUID))
        formContext?.setValue(cruiseManagerSectionFieldNames.mainCruiseManagerId, location?.state.cruise.mainCruiseManagerId)
    else if(!cruiseUsers.map(user=>user.id).includes(mainManagerField) && mainManagerField)
        formContext?.setValue(cruiseManagerSectionFieldNames.mainCruiseManagerId, EMPTY_GUID)
    if(cruiseUsers.map(user=>user.id).includes(location?.state.cruise.mainDeputyManagerId) && (deputyManagerField == EMPTY_GUID))
        formContext?.setValue(cruiseManagerSectionFieldNames.mainDeputyManagerId, location?.state.cruise.mainDeputyManagerId)
    else if(!cruiseUsers.map(user=>user.id).includes(deputyManagerField) && deputyManagerField)
        formContext?.setValue(cruiseManagerSectionFieldNames.mainDeputyManagerId, EMPTY_GUID)



    const users = getUsersFromCruiseApplications()
    return(
        <>
            <UserSelect
                className="two-fields-beside-md"
                fieldName={cruiseManagerSectionFieldNames.mainCruiseManagerId}
                fieldLabel="Kierownik główny"
                required={false}
                initValues={users}
            />
            <UserSelect
                className="two-fields-beside-md"
                fieldName={cruiseManagerSectionFieldNames.mainDeputyManagerId}
                fieldLabel="Zastępca kierownika głównego"
                required={false}
                initValues={users}
            />
            <ErrorMessageIfPresentNoContext message={formContext?.formState?.errors["mainCruiseManagerIsTheSameAsMainDeputyManager"]?.message as string}/>
        </>
    )
}


export const CruiseManagersSection = () => SectionWrapper(
    {
        shortTitle: "Kierownicy",
        longTitle: "Kierownik główny i zastępca kierownika głównego",
        children: <CruiseManagersField/>
    }
)