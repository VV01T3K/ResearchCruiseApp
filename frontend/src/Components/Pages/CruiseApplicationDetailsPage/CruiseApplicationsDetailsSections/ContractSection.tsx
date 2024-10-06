import React, {useContext} from "react";
import {SectionWrapper} from "../../FormPage/Wrappers/FormASections";
import {EvaluatedContractTable} from "../../FormPage/Inputs/ContractsTable/EvaluatedContractsTable";
import {FormContext} from "../../FormPage/Wrappers/FormTemplate";

const contractSectionFieldNames = {
    contracts:"contractsEvaluationsEdits"
}

const ContractsField = () => {
    const formContext = useContext(FormContext)
    return(
        <EvaluatedContractTable className="single-field"
                            fieldLabel=""
                            fieldName={contractSectionFieldNames.contracts}
                            evaluatedContracts={formContext!.initValues?.formAContracts}
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
