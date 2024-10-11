import { SpubTaskTable } from '../../../Inputs/SpubTasksTable';
import React, { useContext } from 'react';
import { spubTasksSectionFieldNames } from './SpubTasksSection';

import { FormContext } from '@contexts/FormContext';

export const SpubTaskField = () => {
    const formContext = useContext(FormContext);
    return (
        <SpubTaskTable
            className={'single-field'}
            fieldName={spubTasksSectionFieldNames.spubTasks}
            fieldLabel={''}
            historicalSpubTasks={formContext!.initValues?.historicalSpubTasks}
        />
    );
};