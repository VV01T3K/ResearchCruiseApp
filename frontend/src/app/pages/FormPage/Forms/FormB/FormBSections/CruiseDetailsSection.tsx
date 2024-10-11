import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import {
    CruiseDetailsDescription, EquipmentLeaveField,
    EquipmentOutsideField, PortLeaveField,
} from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseDetalisSectionFields';


export const cruiseDetailsSectionFieldNames = {
    equipmentLeave: 'equipmentLeave',
    equipmentOutside: 'equipmentOutside',
    portLeave: 'portLeave',
};

export const CruiseDetailsSection = () => SectionWrapper(
    {
        shortTitle: 'Szczegóły',
        longTitle: 'Szczegóły rejsu',
        sectionFieldNames: cruiseDetailsSectionFieldNames,
        children: <>
            <CruiseDetailsDescription />
            <EquipmentOutsideField />
            <EquipmentLeaveField />
            <PortLeaveField />
        </>,
    },
);