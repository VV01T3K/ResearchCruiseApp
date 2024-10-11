import React from 'react';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';

const researchAreaSectionFieldNames = {
    researchArea: 'researchAreaId',
    researchAreaInfo: 'researchAreaInfo',
};

export const ResearchAreaSection = () => SectionWrapper(
    {
        shortTitle: 'Rejon',
        longTitle: 'Rejon prowadzenia badań',
        sectionFieldNames: researchAreaSectionFieldNames,
        children:
            <>

            </>,
    },
);