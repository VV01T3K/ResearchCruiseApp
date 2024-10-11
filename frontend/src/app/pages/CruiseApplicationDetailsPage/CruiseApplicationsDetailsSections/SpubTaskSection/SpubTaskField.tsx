import { useContext } from 'react';
import { FormContext } from '@contexts/FormContext';
import { EvaluatedSpubTaskTable } from '../../../FormPage/Inputs/EvaluatedSpubTasksTable';
import { spubTasksSectionFieldNames } from './SpubTasksSectionFieldNames';

export const SpubTaskField = () => {
    const formContext = useContext(FormContext);
    return (
        <EvaluatedSpubTaskTable
            fieldLabel={''}
            className={'single-field'}
            fieldName={spubTasksSectionFieldNames.spubTasks}
            evaluatedSpubTasks={formContext!.initValues?.formASpubTasks}
        />
    );
};