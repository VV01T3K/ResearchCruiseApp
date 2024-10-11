import { cruiseDetailsSectionFieldNames } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseDetailsSection';
import EquipmentOutsideTable from '@app/pages/FormPage/Inputs/CruiseDetailsTables/EquipmentOutsideTable';
import EquipmentLeaveTable from '@app/pages/FormPage/Inputs/CruiseDetailsTables/EquipmentLeaveTable';
import PortTable from '@app/pages/FormPage/Inputs/CruiseDetailsTables/PortTable';
import { useContext } from 'react';
import { FormContext } from '@contexts/FormContext';


export const CruiseDetailsDescription = () => (

    <h5 className={`pb-0 p-4 col-12 text-center`}>Czy w ramach rejsu
        planuje się:</h5>
);

export const EquipmentOutsideField = () => {
    const formContext = useContext(FormContext);
    return (
        <EquipmentOutsideTable
            className="single-field"
            fieldLabel="Wystawienie sprzętu"
            fieldName={cruiseDetailsSectionFieldNames.equipmentOutside}
            historicalEquipmentOutside={formContext!.initValues?.historicalEquipmentOutside}
        />
    );

};

export const EquipmentLeaveField = () => {
    return (
        <EquipmentLeaveTable
            className="single-field"
            fieldLabel="Pozostawienie lub zabranie sprzętu"
            fieldName={cruiseDetailsSectionFieldNames.equipmentLeave}
        />
    );

};

export const PortLeaveField = () => {
    return (
        <PortTable
            className="single-field"
            fieldLabel="Wchodzenie lub wychodzenie z portu"
            fieldName={cruiseDetailsSectionFieldNames.portLeave}
        />
    );

};