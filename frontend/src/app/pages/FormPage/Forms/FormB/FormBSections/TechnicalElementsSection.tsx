import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import TechnicalElementsTable
    from '@app/pages/FormPage/Inputs/TechnicalElementsTable/TechnicalElementsTable';
import ListWithCheckbox from '@app/pages/FormPage/Inputs/ListWithCheckbox';

export const technicalElementsSectionFieldNames = {
    technicalElements: 'technicalElements',
};
export const TechnicalElementsSection = () => SectionWrapper(
    {
        shortTitle: 'E. techniczne',
        longTitle: 'Elementy techniczne statku wykorzystywane podczas rejsu',
        sectionFieldNames: technicalElementsSectionFieldNames,
        children: <>
            <ListWithCheckbox className={'single-field'}
                              fieldName={technicalElementsSectionFieldNames.technicalElements}
                              fieldLabel={'Elementy techniczne'}
                              initValues={[
                                  { id: 'sadsdsad', name: 'asdassdasdd' },
                                  { id: 'sadsds21ad', name: 'asdasdsadasdd' },
                                  { id: 'sad123sdsad', name: 'assaddasdasdd' },
                                  { id: 'sad321sdsad', name: 'asdggasdasdd' },
                                  { id: 'sad132sdsad', name: 'asssdasdasdd' },
                                  { id: 'sad213sdsad', name: 'asdaccsdasdd' },
                              ]}
            />
            {/*<TechnicalElementsTable*/}
            {/*    className={'single-field'}*/}
            {/*    fieldName={technicalElementsSectionFieldNames.technicalElements}*/}
            {/*    fieldLabel={'Elementy techniczne'}*/}
            {/*/>*/}
        </>,
    },
);