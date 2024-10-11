import { ContractTable } from '../../../Inputs/ContractsTable/ContractsTable';
import React, { useContext } from 'react';
import { contractSectionFieldNames } from './ContractSection';

import { FormContext } from '@contexts/FormContext';

export const ContractsField = () => {
    const formContext = useContext(FormContext);
    return (
        <ContractTable className="single-field"
                       fieldLabel=""
                       fieldName={contractSectionFieldNames.contracts}
                       historicalContracts={formContext!.initValues?.historicalContracts}
        />
    );
};