import {PermissionsField} from './PermissionsSectionFields';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';

export const permissionsSectionFieldNames = {
    permissionsRequired: 'permissionsRequired',
    permissions: 'permissions',
};

export const PermissionsSection = () => SectionWrapper(
    {
        shortTitle: 'Pozwolenia',
        longTitle: 'Dodatkowe pozwolenia do planowanych podczas rejsu badań',
        sectionFieldNames: permissionsSectionFieldNames,
        children: <PermissionsField />,
    },
);