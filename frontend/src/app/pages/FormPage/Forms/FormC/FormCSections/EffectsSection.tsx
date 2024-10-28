import React from 'react';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import ReadonlyOverrideWrapper from '@components/Form/ReadonlyOverrideWrapper';
import { TasksField } from '@app/pages/FormPage/Forms/FormA/FormASections/TasksSectionFields';
import {researchTasksSectionFieldNames} from "@app/pages/FormPage/Forms/FormA/FormASections/TasksSection";
import {FormAInitValues} from "FormAInitValues";
import {TasksTable} from "@app/pages/FormPage/Inputs/TaskTable/TaskTable";
import {EffectsTable} from "@app/pages/FormPage/Inputs/EffectsTable/EffectsTable";

export const effectsSectionFieldNames = {
    effects: 'effects',
};

export const EffectsSection = () => SectionWrapper(
    {
        shortTitle: 'Efekty',
        longTitle: 'Efekty rejsu',
        sectionFieldNames: effectsSectionFieldNames,
        children: <EffectsTable className="single-field"
                              fieldLabel=""
                              fieldName={effectsSectionFieldNames.effects}
        />
    },
);