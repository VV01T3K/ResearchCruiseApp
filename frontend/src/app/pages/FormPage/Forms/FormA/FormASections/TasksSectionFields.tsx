import { TasksTable } from '../../../Inputs/TaskTable/TaskTable';
import React, { useContext } from 'react';
import { researchTasksSectionFieldNames } from './TasksSection';

import { FormContext } from '@contexts/FormContext';

export const TasksField = () => {
    const formContext = useContext(FormContext);
    return (
        <TasksTable className="single-field"
                    fieldLabel=""
                    fieldName={researchTasksSectionFieldNames.researchTasks}
                    historicalTasks={formContext!.initValues?.historicalResearchTasks}
        />
    );
};
