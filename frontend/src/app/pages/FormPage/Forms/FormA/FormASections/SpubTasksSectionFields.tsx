import {SpubTaskTable} from '../../../Inputs/SpubTasksTable';
import {useContext} from 'react';
import {spubTasksSectionFieldNames} from './SpubTasksSection';

import {FormContext} from '@contexts/FormContext';
import {FormAInitValues} from 'FormAInitValues';

export const SpubTaskField = () => {
    const formContext = useContext(FormContext);
    return (
        <SpubTaskTable
            className={'single-field'}
            fieldName={spubTasksSectionFieldNames.spubTasks}
            fieldLabel={''}
            historicalSpubTasks={(formContext!.initValues as FormAInitValues)?.historicalSpubTasks}
        />
    );
};