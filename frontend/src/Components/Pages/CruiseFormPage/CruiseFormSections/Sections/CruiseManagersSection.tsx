import {FormSectionType, SectionIdFromTitle, SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../../FormPage/Wrappers/FormSection";
import UserSelect, {FormUser} from "../../../FormPage/Inputs/UserSelect";
import React, {useContext, useEffect} from "react";
import {CruiseApplicationsContext} from "../../CruiseFormPage";
import {FormContext} from "../../../FormPage/Wrappers/FormTemplate";
import {ErrorMessageIfPresentNoContext} from "../../../CommonComponents/ErrorMessageIfPresent";
import {ApplicationToCruiseManagersMapper} from "../CruiseListMisc";

export const cruiseManagerSectionFieldNames = {
    mainCruiseManagerId:"managersTeam.mainCruiseManagerId",
    mainDeputyManagerId:"managersTeam.mainDeputyManagerId",
    year:"year"
}

const getUsersFromCruiseApplications = (): FormUser[] => {
    const cruiseApplicationsContext = useContext(CruiseApplicationsContext)
    const usersPairs = cruiseApplicationsContext!.cruiseApplications.map(ApplicationToCruiseManagersMapper)

    // leave only unique values
    return usersPairs.flat().filter((value, index, array) =>
        // look at the id only to determine the uniqueness,
        array.map(user => user.id)
            // leave only the first occurrence of the given user
       .indexOf(value.id) === index)
}

const CruiseManagersField = () => {
    const formContext = useContext(FormContext)


    useEffect(() => {
        const areFieldsEqual = formContext!.getValues(cruiseManagerSectionFieldNames.mainCruiseManagerId)
            == formContext!.getValues(cruiseManagerSectionFieldNames.mainDeputyManagerId)
        if(areFieldsEqual && !formContext?.formState.errors["mainCruiseManagerIsTheSameAsMainDeputyManager"])
            formContext!.setError("mainCruiseManagerIsTheSameAsMainDeputyManager",
                {type:"custom",message:"Kierownik i jego zastępca muszą być innymi osobami"})
        else if(!areFieldsEqual && formContext?.formState.errors["mainCruiseManagerIsTheSameAsMainDeputyManager"])
            formContext!.clearErrors("mainCruiseManagerIsTheSameAsMainDeputyManager")
    }, []);

    const users = getUsersFromCruiseApplications()
    return(
        <>
            <UserSelect
                className="two-fields-beside-md"
                fieldName={cruiseManagerSectionFieldNames.mainCruiseManagerId}
                fieldLabel="Kierownik główny"
                initValues={users}
            />
            <UserSelect
                className="two-fields-beside-md"
                fieldName={cruiseManagerSectionFieldNames.mainDeputyManagerId}
                fieldLabel="Zastępca kierownika głównego"
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