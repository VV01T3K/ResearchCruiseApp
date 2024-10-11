import React, { useContext } from 'react';
import { FormContext } from '@contexts/FormContext';
import { EvaluatedContractTable } from '../../../FormPage/Inputs/ContractsTable/EvaluatedContractsTable';

import { contractSectionFieldNames } from './ContractSectionFieldNames';

export const ContractsField = () => {
    const formContext = useContext(FormContext);
    return (
        <EvaluatedContractTable className="single-field"
                                fieldLabel=""
                                fieldName={contractSectionFieldNames.contracts}
                                evaluatedContracts={formContext!.initValues?.formAContracts}
        />
    );
};