import TextArea from "../../Inputs/TextArea";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React, {useContext} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../Wrappers/FormASections";
import ResearchAreaSelect from "../../Inputs/ClickableMap";
import FormRadio from "../../Inputs/FormRadio";
import {FormContext} from "../../Wrappers/FormTemplate";
import {TasksTable} from "../../Inputs/TaskTable/TaskTable";
import {ContractTable} from "../../Inputs/ContractsTable/ContractsTable";

const contractSectionFieldNames = {
    contracts:"contracts"
}

const ContractsField = () => {
    //const formContext = useContext(FormContext)
    return(
        <ContractTable className="single-field"
                            fieldLabel=""
                            fieldName={contractSectionFieldNames.contracts}
                            historicalContracts={[
                                {
                                    category: "international",
                                    name: "Instytucja 1",
                                    unit: "Jednostka 1",
                                    localization: "Lokalizacja 1",
                                    description: "Opis 1",
                                    scan: {
                                        name: "Skan 1",
                                        content: "1111111111"
                                    }
                                },
                                {
                                    category: "domestic",
                                    name: "Instytucja 2",
                                    unit: "Jednostka 2",
                                    localization: "Lokalizacja 2",
                                    description: "Opis 2",
                                    scan: {
                                        name: "Skan 2",
                                        content: "222222222"
                                    }
                                },
                            ]}
        />
    )
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