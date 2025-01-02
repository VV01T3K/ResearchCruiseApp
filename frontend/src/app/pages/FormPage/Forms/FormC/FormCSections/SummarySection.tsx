import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import TextArea from "@app/pages/FormPage/Inputs/TextArea";


export const summaryFieldNames = {
    additionalDescription: 'additionalDescription'
};

export const SummarySection = () => SectionWrapper(
    {
        shortTitle: 'Podsumowanie',
        longTitle: 'Podsumowanie rejsu',
        sectionFieldNames: summaryFieldNames,
        children:
            <TextArea className="single-field"
                      fieldLabel="Opis"
                      placeholder={'Krótki opis podsumowujący dany rejs (do ewentualnego wykorzystania do celów promocyjnych, na stronie internetowej, FB itp.)'}
                      fieldName={summaryFieldNames.additionalDescription}
                      required="Opisz cel"
            />
    },
);