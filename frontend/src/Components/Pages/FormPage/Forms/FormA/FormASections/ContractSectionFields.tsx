import {ContractTable} from "../../../Inputs/ContractsTable/ContractsTable";
import React from "react";
import {contractSectionFieldNames} from "./ContractSection";

export const ContractsField = () => {
    //const formContext = useContext(FormContext)
    return(
        <ContractTable className="single-field"
                       fieldLabel=""
                       fieldName={contractSectionFieldNames.contracts}
                       historicalContracts={[
                           {
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
                       ]}
        />
    )
}