import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import {ContractsField} from "./ContractSectionFields";

export const contractSectionFieldNames = {
    contracts:"contracts"
}

export const ContractSection = ():FormSectionType => {
    const shortTitle = "Umowy"
    const longTitle = "Umowy regulujące współpracę," +
        " w ramach której miałyby być realizowane zadania badawcze"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <ContractsField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:contractSectionFieldNames}
}