import {FieldProps} from '@app/pages/FormPage/Inputs/FormRadio';
import {useContext} from 'react';
import {
    InsuranceColumn,
    NameField,
    PermissionField,
} from '@app/pages/FormPage/Inputs/EquipmentTable/EquipmentTableFields';
import {BottomMenuWithAddButton, OrdinalNumber, RemoveRowButton} from '@app/pages/FormPage/Inputs/TableParts';
import {FieldValues} from 'react-hook-form';
import {SingleValue} from 'react-select';
import {FieldTableWrapper} from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import {FormContext} from '@contexts/FormContext';
import {FieldContext} from '@contexts/FieldContext';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';
import {ResearchEquipment} from 'ResearchEquipment';
import {researchEquipmentDefault} from '@helpers/researchEquipmentDefault';

type EquipmentProps = FieldProps


const equipmentTableContent = () => {
    return [
        () => (<OrdinalNumber label={'Sprzęt'} />),
        NameField,
        InsuranceColumn,
        PermissionField,
        RemoveRowButton,
    ];
};

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function EquipmentTable(props: EquipmentProps) {


    const formContext = useContext(FormContext);


    const mdColWidths = [5, 41, 35, 14, 5];
    const mdColTitles = ['Lp.', 'Nazwa sprzętu / aparatury', 'Data zgłoszenia do ubezpieczenia (jeśli zgłoszono)', 'Czy uzyskano zgodę opiekuna', ''];
    const colTitle = 'Lista sprzętu i aparatury badawczej';
    const bottomMenu =
        <BottomMenuWithAddButton newOption={researchEquipmentDefault as SingleValue<any>} />;
    const emptyText = 'Nie dodano żadnego sprzętu';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, equipmentTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                nameNeeded: (value: ResearchEquipment[]) =>
                    (value.length > 0 && value.some((row) => !row.name)) ? 'Wpisz nazwę sprzętu' : true,
                bothDatesNeeded: (value: ResearchEquipment[]) =>
                    (value.length > 0 && value.some((row) =>
                        (row.insuranceStartDate && !row.insuranceEndDate) || (!row.insuranceStartDate && row.insuranceEndDate),
                    )) ? 'Podaj obydwie daty' : true,
                rightYearPeriod: (value: FieldValues) => {
                    if (value.some((row: ResearchEquipment) => (row.insuranceStartDate && row.insuranceEndDate) && row.insuranceEndDate < row.insuranceStartDate)) {
                        return 'Data zakończenia przed datą rozpoczęcia';
                    }
                },
            },
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default EquipmentTable;
