import React from 'react';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import TextArea from "@app/pages/FormPage/Inputs/TextArea";


export const summaryFieldNames = {
    summary: 'summary'
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
                      fieldName={summaryFieldNames.summary}
                      required="Opisz cel"
            />
    },
);