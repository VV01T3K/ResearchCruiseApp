import UserSelect from "../../Inputs/UserSelect";
import FormYearSelect from "../../Inputs/FormYearSelect";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React, {useContext} from "react";
import {FormSectionType, SectionIdFromTitle} from "../../Wrappers/FormASections";
import {FormContext} from "../../Wrappers/FormTemplate";
import {useFormContext} from "react-hook-form";

const CruiseManagerField = () => {
    const formContext = useContext(FormContext)
    return(
        <UserSelect className="three-fields-beside-md" fieldName="cruiseManagerId" fieldLabel="Kierownik rejsu"
                    // initValues={formContext?.initValues?.cruiseManagers}
        />
    )
}
const DeputyManagerField = () => {
    const formContext = useContext(FormContext)
        return(
        <UserSelect className="three-fields-beside-md" fieldName="deputyManagerId" fieldLabel="Zastępca"
                    // initValues={formContext!.initValues?.deputyManagers}
        />
        )
}
const YearField = () => {
    const formContext = useContext(FormContext)
    return(
        <FormYearSelect className="three-fields-beside-md" fieldName="year" fieldLabel="Rok rejsu"
                        // initValues={formContext!.initValues?.years}
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
    return {Content, id, shortTitle, longTitle}
}