import {ContractTable} from '../../../Inputs/ContractsTable/ContractsTable';
import {useContext} from 'react';
import {contractSectionFieldNames} from './ContractSection';

import {FormContext} from '@contexts/FormContext';
import {FormAInitValues} from 'FormAInitValues';

export const ContractsField = () => {
    const formContext = useContext(FormContext);
    return (
        <ContractTable className="single-field"
                       fieldLabel=""
                       fieldName={contractSectionFieldNames.contracts}
                       historicalContracts={(formContext!.initValues as FormAInitValues)?.historicalContracts}
        />
    );
};