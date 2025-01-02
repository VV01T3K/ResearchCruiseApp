import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {researchTasksSectionFieldNames} from './ResearchTasksSectionFieldNames';
import {TasksField} from './TasksField';


export const TaskSection = () => SectionWrapper(
    {
        shortTitle: 'Zadania',
        longTitle: 'Zadania do zrealizowania w trakcie rejsu',
        sectionFieldNames: researchTasksSectionFieldNames,
        children: <TasksField />,
    },
);
