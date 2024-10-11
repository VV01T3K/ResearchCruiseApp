import React from 'react';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';

export const permissionsSectionFieldNames = {
    permissions: 'permissions',
};


export const PermissionsSection = () => SectionWrapper(
    {
        shortTitle: 'Pozwolenia',
        longTitle: 'Dodatkowe pozwolenia do planowanych podczas rejsu badań',
        sectionFieldNames: permissionsSectionFieldNames,
        children:
            <>

            </>,
    },
);