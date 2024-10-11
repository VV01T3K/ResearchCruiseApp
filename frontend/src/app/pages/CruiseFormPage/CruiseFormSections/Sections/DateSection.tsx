import React from 'react';
import { EndDateField, StartDateField } from '../../../FormPage/Inputs/DateField';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';

export const dateSectionFieldNames = {
    startDate: 'startDate',
    endDate: 'endDate',
};

const CruiseStartDateField = () => {
    return (
        <>
            <StartDateField
                className={'two-fields-beside-md'}
                fieldName={dateSectionFieldNames.startDate}
                fieldLabel={'Początek'}
                EndDateFieldName={dateSectionFieldNames.endDate} />
            <EndDateField
                className={'two-fields-beside-md'}
                fieldName={dateSectionFieldNames.endDate}
                fieldLabel={'Koniec'}
                StartDateFieldName={dateSectionFieldNames.startDate} />
        </>

    );
};

export const InfoSection = () => SectionWrapper(
    {
        shortTitle: 'Termin',
        longTitle: 'Termin rejsu',
        children:
            <>
                <CruiseStartDateField />
            </>,
    },
);