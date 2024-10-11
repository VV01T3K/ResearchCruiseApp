import { SingleValue } from 'react-select';
import { FieldTableWrapper } from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import { fileExists } from '@app/pages/FormPage/Inputs/ContractsTable/ContractsTable';
import { FormContext } from '@contexts/FormContext';
import { FieldProps } from '@app/pages/FormPage/Inputs/FormRadio';
import { useContext } from 'react';
import {
    BottomMenuWithAddButtonAndHistory,
    OrdinalNumber,
    RemoveRowButton,
} from '@app/pages/FormPage/Inputs/TableParts';
import {
    EndDateField, NameField,
    StartDateField,
} from '@app/pages/FormPage/Inputs/CruiseDetailsTables/EquipmentOutsideTableFields';
import { FieldValues } from 'react-hook-form';
import { notEmptyArray } from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';
import { FieldContext } from '@contexts/FieldContext';


export type EquipmentOutside = {
    startDate: string,
    endDate: string,
    name: string
}

const equipmentOutsideDefault = {
    startDate: '',
    endDate: '',
    name: '',
};

type EquipmentOutsideTableProps = FieldProps &
    { historicalEquipmentOutside?: EquipmentOutside[] }

const EquipmentOutsideRowLabel = (row: EquipmentOutside) =>
    `Od: ${row.startDate}\n
    Do: ${row.endDate}\n
    Nazwa sprzętu: ${row.name}\n`;


const EquipmentOutsideTableContent = () => {
    const formContext = useContext(FormContext);

    return [
        () => (<OrdinalNumber label={'Sprzęt'} />),
        StartDateField,
        EndDateField,
        NameField,
        RemoveRowButton,
    ];
};

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function EquipmentOutsideTable(props: EquipmentOutsideTableProps) {


    const formContext = useContext(FormContext);

    const selectOptions = props.historicalEquipmentOutside?.map((row: EquipmentOutside) =>
        ({ label: EquipmentOutsideRowLabel(row), value: row })) ?? [];

    const mdColWidths = [5, 30, 30, 30, 5];
    const mdColTitles = ['Lp.', 'Od', 'Do', 'Nazwa sprzętu', ''];
    const colTitle = '';
    const bottomMenu =
        <BottomMenuWithAddButtonAndHistory newOption={equipmentOutsideDefault as SingleValue<any>}
                                           historicalOptions={selectOptions} />;
    const emptyText = 'Nie dodano żadnego sprzętu';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, EquipmentOutsideTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<EquipmentOutside>,
                fileExists: fileExists,
            },
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default EquipmentOutsideTable;
