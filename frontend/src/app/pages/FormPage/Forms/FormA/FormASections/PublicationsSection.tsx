import {PublicationsDescription, PublicationsField} from './PublicationsSectionFields';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';

export const publicationsSectionFieldNames = {
    publications: 'publications',
};

export const PublicationsSection = () => SectionWrapper(
    {
        shortTitle: 'Publikacje',
        longTitle: 'Publikacje',
        sectionFieldNames: publicationsSectionFieldNames,
        children:
            <>
                <PublicationsDescription />
                <PublicationsField />
            </>,
    },
);