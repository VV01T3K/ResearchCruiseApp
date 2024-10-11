import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import TechnicalElementsTable
    from '@app/pages/FormPage/Inputs/TechnicalElementsTable/TechnicalElementsTable';

export const technicalElementsSectionFieldNames = {
    technicalElements: 'technicalElements',
};
export const TechnicalElementsSection = () => SectionWrapper(
    {
        shortTitle: 'E. techniczne',
        longTitle: 'Elementy techniczne statku wykorzystywane podczas rejsu',
        sectionFieldNames: technicalElementsSectionFieldNames,
        children: <>
            <TechnicalElementsTable
                className={'single-field'}
                fieldName={technicalElementsSectionFieldNames.technicalElements}
                fieldLabel={'Elementy techniczne'}
            />
        </>,
    },
);