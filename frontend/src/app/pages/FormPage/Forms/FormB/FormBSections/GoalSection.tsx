import React from 'react';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import {
    CruiseGoalDescriptionField,
    CruiseGoalField,
} from '@app/pages/FormPage/Forms/FormA/FormASections/GoalSectionFields';


export const goalSectionFieldNames = {
    cruiseGoal: 'cruiseGoal',
    cruiseGoalDescription: 'cruiseGoalDescription',
};

export const GoalSection = () => SectionWrapper(
    {
        shortTitle: 'Cel',
        longTitle: 'Cel rejsu',
        sectionFieldNames: goalSectionFieldNames,
        children:
            <>
                <CruiseGoalField />
                <CruiseGoalDescriptionField />
            </>,
    },
);