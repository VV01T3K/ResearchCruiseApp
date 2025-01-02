import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import EquipmentTable from '@app/pages/FormPage/Inputs/EquipmentTable/EquipmentTable';

export const equipmentSectionFieldNames = {
    researchEquipments: 'researchEquipments',
};

export const EquipementSection = () => SectionWrapper(
    {
        shortTitle: 'Sprzęt',
        longTitle: 'Lista sprzętu i aparatury badawczej użytej podczas rejsu',
        sectionFieldNames: equipmentSectionFieldNames,
        children: <>
            <EquipmentTable
                className={'single-field'}
                fieldName={equipmentSectionFieldNames.researchEquipments}
                fieldLabel={'Lista sprzętu i aparatury badawczej'}
            />
        </>,
    },
);