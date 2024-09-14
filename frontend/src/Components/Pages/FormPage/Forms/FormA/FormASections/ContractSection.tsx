import React from "react";
import {SectionWrapper} from "../../../Wrappers/FormASections";
import {ContractsField} from "./ContractSectionFields";

export const contractSectionFieldNames = {
    contracts:"contracts"
}

export const ContractSection = () =>
    SectionWrapper(
        {
            shortTitle: "Umowy",
            longTitle: "Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze",
            sectionFieldNames: contractSectionFieldNames,
            children: <ContractsField/>
        }
        )

