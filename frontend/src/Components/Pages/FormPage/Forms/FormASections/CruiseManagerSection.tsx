import UserSelect, {FormUser} from "../../Inputs/UserSelect";
import FormYearSelect from "../../Inputs/FormYearSelect";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React, {useContext, useEffect, useState} from "react";
import {FormSectionType, SectionIdFromTitle} from "../../Wrappers/FormASections";
import {FormContext} from "../../Wrappers/FormTemplate";
import userDataManager from "../../../../CommonComponents/UserDataManager";

const cruiseManagerSectionFieldNames = {
    cruiseManagerId:"cruiseManagerId",
    deputyManagerId:"deputyManagerId",
    year:"year"
}


const CruiseManagerField = () => {
    const formContext = useContext(FormContext)
    const {userData} = userDataManager()
    useEffect(() => {
        if(userData) {
            const foundUserManager = formContext!.initValues?.deputyManagers.find((user: FormUser) => user.id == userData.id)
            console.log(foundUserManager)
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
const DeputyManagerField = () => {

    const formContext = useContext(FormContext)
        return(
        <UserSelect className="three-fields-beside-md" fieldName={cruiseManagerSectionFieldNames.deputyManagerId} fieldLabel="Zastępca"
                    initValues={formContext!.initValues?.deputyManagers}
        />
        )
}
const YearField = () => {
    const formContext = useContext(FormContext)
    return(
        <FormYearSelect className="three-fields-beside-md" fieldName={cruiseManagerSectionFieldNames.year} fieldLabel="Rok rejsu"
                        initValues={formContext!.initValues?.years}
        />
    )
}

export const CruiseManagerSection = ():FormSectionType => {
    const shortTitle = "Kierownik"
    const longTitle = "Kierownik zgłaszanego rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <CruiseManagerField/>
            <DeputyManagerField/>
            <YearField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:cruiseManagerSectionFieldNames}
}