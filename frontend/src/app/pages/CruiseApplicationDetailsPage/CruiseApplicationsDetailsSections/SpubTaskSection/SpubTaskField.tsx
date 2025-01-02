import {useContext} from 'react';
import {FormContext} from '@contexts/FormContext';
import {EvaluatedSpubTaskTable} from '../../../FormPage/Inputs/EvaluatedSpubTasksTable';
import {spubTasksSectionFieldNames} from './SpubTasksSectionFieldNames';
import {CruiseApplicationDetailsFormInitValues} from 'CruiseApplicationDetailsFormInitValues';

export const SpubTaskField = () => {
    const formContext = useContext(FormContext);
    return (
        <EvaluatedSpubTaskTable
            fieldLabel={''}
            className={'single-field'}
            fieldName={spubTasksSectionFieldNames.spubTasks}
            evaluatedSpubTasks={(formContext!.initValues as CruiseApplicationDetailsFormInitValues)?.formASpubTasks}
        />
    );
};