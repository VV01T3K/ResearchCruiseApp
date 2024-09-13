import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React, {useContext, useEffect, useState} from "react";
import {FormSectionType, SectionIdFromTitle} from "../../../Wrappers/FormASections";
import {CruiseManagerField, DeputyManagerField, YearField} from "./CruiseManagerSectionFields";
import {FormContext} from "../../../Wrappers/FormTemplate";
import {CruiseApplicationDeputyManagerName} from "../../../../CruiseApplicationDetailsPage/CruiseApplicationInfo";
import {ErrorMessageIfPresentNoContext} from "../../../../CommonComponents/ErrorMessageIfPresent";

export const cruiseManagerSectionFieldNames = {
    cruiseManagerId:"cruiseManagerId",
    deputyManagerId:"deputyManagerId",
    year:"year"
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

export const CruiseManagerSection = (): FormSectionType => {
    const shortTitle = "Kierownik"
    const longTitle = "Kierownik zgłaszanego rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <CruiseAndDeputyManager/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:cruiseManagerSectionFieldNames}
}