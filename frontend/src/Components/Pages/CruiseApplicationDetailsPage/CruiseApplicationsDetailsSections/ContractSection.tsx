import React from "react";
import {SectionWrapper} from "../../FormPage/Wrappers/FormASections";
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


export const ContractSection = () => SectionWrapper(
    {
        shortTitle: "Umowy",
        longTitle: "Umowy regulujące współpracę w ramach której miałyby być realizowane zadania badawcze",
        sectionFieldNames:contractSectionFieldNames,
        children:  <ContractsField/>
    }
)
