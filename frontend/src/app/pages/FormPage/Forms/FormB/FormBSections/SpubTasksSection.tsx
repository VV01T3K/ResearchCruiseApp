import { SectionIdFromTitle } from '@components/Form/Section/helpers/SectionIdFromTitle';
import Section from '@components/Form/Section/Section';
import { SectionContentProps } from 'Form/Section/SectionContentProps';
import { FormSectionType } from 'Form/Section/FormSectionType';

export const spubTasksSectionFieldNames = {
    spubTasks: 'spubTasks',
};

export const SpubTasksSection = (): FormSectionType => {
    const shortTitle = 'SPUB';
    const longTitle =
        'Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie';
    const id = SectionIdFromTitle(shortTitle);

    const Content = (props: SectionContentProps) => (
        <Section index={props.index} id={id} title={longTitle}>

        </Section>
    );
    return { Content, id, shortTitle, longTitle, sectionFieldNames: spubTasksSectionFieldNames };
};