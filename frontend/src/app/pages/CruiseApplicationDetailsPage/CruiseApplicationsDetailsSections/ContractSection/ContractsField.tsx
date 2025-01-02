import {useContext} from 'react';
import {FormContext} from '@contexts/FormContext';
import {EvaluatedContractTable} from '../../../FormPage/Inputs/ContractsTable/EvaluatedContractsTable';

import {contractSectionFieldNames} from './ContractSectionFieldNames';
import {CruiseApplicationDetailsFormInitValues} from 'CruiseApplicationDetailsFormInitValues';

export const ContractsField = () => {
    const formContext = useContext(FormContext);
    return (
        <EvaluatedContractTable className="single-field"
                                fieldLabel=""
                                fieldName={contractSectionFieldNames.contracts}
                                evaluatedContracts={(formContext!.initValues as CruiseApplicationDetailsFormInitValues)?.formAContracts}
        />
    );
};