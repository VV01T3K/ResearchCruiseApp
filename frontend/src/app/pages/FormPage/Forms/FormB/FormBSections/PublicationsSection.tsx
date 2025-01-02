import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {
    PublicationsDescription,
    PublicationsField,
} from '@app/pages/FormPage/Forms/FormA/FormASections/PublicationsSectionFields';
import ReadonlyOverrideWrapper from '@components/Form/ReadonlyOverrideWrapper';

export const publicationsSectionFieldNames = {
    publications: 'publications',
};

export const PublicationsSection = () => SectionWrapper(
    {
        shortTitle: 'Publikacje',
        longTitle: 'Publikacje',
        sectionFieldNames: publicationsSectionFieldNames,
        children:
            <ReadonlyOverrideWrapper>
                <PublicationsDescription />
                <PublicationsField />
            </ReadonlyOverrideWrapper>,
    },
);