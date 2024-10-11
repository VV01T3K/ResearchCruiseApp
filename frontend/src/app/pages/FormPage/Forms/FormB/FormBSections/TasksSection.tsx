import React from 'react';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';


export const researchTasksSectionFieldNames = {
    researchTasks: 'researchTasks',
};

export const TasksSection = () => SectionWrapper(
    {
        shortTitle: 'Zadania',
        longTitle: 'Zadania do zrealizowania w trakcie rejsu',
        sectionFieldNames: researchTasksSectionFieldNames,
        children: <></>,
    },
);