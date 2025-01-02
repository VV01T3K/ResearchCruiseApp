import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {PermissionsField} from '@app/pages/FormPage/Forms/FormB/FormBSections/PermissionsSectionFields';

export const permissionsSectionFieldNames = {
    permissions: 'permissions',
};


export const PermissionsSection = () => SectionWrapper(
    {
        shortTitle: 'Pozwolenia',
        longTitle: 'Dodatkowe pozwolenia do wykonanych podczas rejsu badań',
        sectionFieldNames: permissionsSectionFieldNames,
        children:
            <>
                <PermissionsField />
            </>,
    },
);