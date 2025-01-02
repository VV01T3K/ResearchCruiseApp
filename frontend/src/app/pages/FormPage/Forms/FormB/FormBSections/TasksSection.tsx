import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import ReadonlyOverrideWrapper from '@components/Form/ReadonlyOverrideWrapper';
import {TasksField} from '@app/pages/FormPage/Forms/FormA/FormASections/TasksSectionFields';

export const researchTasksSectionFieldNames = {
    researchTasks: 'researchTasks',
};

export const TasksSection = () => SectionWrapper(
    {
        shortTitle: 'Zadania',
        longTitle: 'Zadania do zrealizowania w trakcie rejsu',
        sectionFieldNames: researchTasksSectionFieldNames,
        children: <ReadonlyOverrideWrapper>
            <TasksField />
        </ReadonlyOverrideWrapper>,
    },
);