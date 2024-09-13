import React from "react";
import {FormSectionType, SectionIdFromTitle} from "../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../FormPage/Wrappers/FormSection";
import {EvaluatedContractTable} from "../../FormPage/Inputs/ContractsTable/EvaluatedContractsTable";

const contractSectionFieldNames = {
    contracts:"contracts"
}

const ContractsField = () => {
    //const formContext = useContext(FormContext)
    return(
        <EvaluatedContractTable className="single-field"
                            fieldLabel=""
                            fieldName={contractSectionFieldNames.contracts}
                            evaluatedContracts={[
                                {id:"dasdads",
                                    contract:  {
                                        category: "international",
                                        institutionName: "Instytucja 1",
                                        institutionUnit: "Jednostka 1",
                                        institutionLocalization: "Lokalizacja 1",
                                        description: "Opis 1",
                                        scan: {
                                            name: "Skan 1",
                                            content: "1111111111"
                                        }
                                    },
                                    calculatedPoints:"0"
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