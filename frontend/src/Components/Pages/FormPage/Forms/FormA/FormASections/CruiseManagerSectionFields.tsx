import React, {useContext, useEffect} from "react";
import {FormContext} from "../../../Wrappers/FormTemplate";
import userDataManager from "../../../../../CommonComponents/UserDataManager";
import UserSelect, {FormUser} from "../../../Inputs/UserSelect";
import FormYearSelect from "../../../Inputs/FormYearSelect";
import {cruiseManagerSectionFieldNames} from "./CruiseManagerSection";
import {ErrorMessageIfPresentNoContext} from "../../../../CommonComponents/ErrorMessageIfPresent";

export const CruiseManagerField = () => {
    const formContext = useContext(FormContext)
    const {userData} = userDataManager()
    useEffect(() => {
        if(userData) {
            const foundUserManager = formContext!.initValues?.deputyManagers.find((user: FormUser) => user.id == userData.id)
            if(foundUserManager)
                formContext?.setValue(cruiseManagerSectionFieldNames.cruiseManagerId, foundUserManager!.id)
        }
    }, [userData]);
    return(
        <UserSelect className="three-fields-beside-md" fieldName={cruiseManagerSectionFieldNames.cruiseManagerId} fieldLabel="Kierownik rejsu"
                    initValues={formContext?.initValues?.cruiseManagers}
        />
    )
}
export const DeputyManagerField = () => {
    const formContext = useContext(FormContext)
    return(
        <UserSelect className="three-fields-beside-md" fieldName={cruiseManagerSectionFieldNames.deputyManagerId} fieldLabel="Zastępca"
                    initValues={formContext!.initValues?.deputyManagers}
        />
    )
}
export const YearField = () => {
    const formContext = useContext(FormContext)
    return(
        <FormYearSelect className="three-fields-beside-md" fieldName={cruiseManagerSectionFieldNames.year} fieldLabel="Rok rejsu"
                        initValues={formContext!.initValues?.years}
        />
    )
}

export const CruiseAndDeputyManager = () => {
    const formContext = useContext(FormContext)
    useEffect(() => {
        const areFieldsEqual = formContext!.getValues(cruiseManagerSectionFieldNames.cruiseManagerId)
            == formContext!.getValues(cruiseManagerSectionFieldNames.deputyManagerId)
        if(areFieldsEqual && !formContext?.formState.errors["cruiseManagerIsTheSameAsDeputyManager"])
            formContext!.setError("cruiseManagerIsTheSameAsDeputyManager",
                {type:"custom",message:"Kierownik i jego zastępca muszą być innymi osobami"})
        else if(!areFieldsEqual && formContext?.formState.errors["cruiseManagerIsTheSameAsDeputyManager"])
            formContext!.clearErrors("cruiseManagerIsTheSameAsDeputyManager")
    }, []);

    return (
        <>
            <div className={"d-flex flex-row w-100"}>
                <CruiseManagerField/>
                <DeputyManagerField/>
                <YearField/>
            </div>
            <ErrorMessageIfPresentNoContext
                message={formContext?.formState?.errors["cruiseManagerIsTheSameAsDeputyManager"]?.message as string}/>
        </>

    )

}