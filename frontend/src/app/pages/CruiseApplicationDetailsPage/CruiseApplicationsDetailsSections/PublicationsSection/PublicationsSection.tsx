import {FormSectionType} from 'Form/Section/FormSectionType';
import {SectionIdFromTitle} from '@components/Form/Section/helpers/SectionIdFromTitle';
import Section from '../../../../../components/Form/Section/Section';
import {SectionContentProps} from 'Form/Section/SectionContentProps';
import {PublicationsSectionFieldNames} from './PublicationsSectionFieldNames';
import {PublicationsField} from './PublicationsField';


export const PublicationsSection = (): FormSectionType => {
    const shortTitle = 'Publikacje';
    const longTitle = 'Publikacje';
    const id = SectionIdFromTitle(shortTitle);

    const Content = (props: SectionContentProps) => (
        <Section index={props.index} id={id} title={longTitle}>
            <PublicationsField />
        </Section>
    );
    return { Content, id, shortTitle, longTitle, sectionFieldNames: PublicationsSectionFieldNames };
};