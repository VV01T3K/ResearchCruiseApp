import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {
    CruiseDetailsDescription,
    EquipmentLeaveField,
    EquipmentOutsideField,
    PortLeaveField,
} from '@app/pages/FormPage/Forms/FormC/FormCSections/CruiseDetalisSectionFields';


export const cruiseDetailsSectionFieldNames = {
    shortResearchEquipments: 'shortResearchEquipments',
    longResearchEquipments: 'longResearchEquipments',
    ports: 'ports',
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