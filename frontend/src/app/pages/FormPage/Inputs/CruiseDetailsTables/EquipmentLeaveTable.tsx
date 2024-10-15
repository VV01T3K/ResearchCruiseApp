import { FieldProps } from '@app/pages/FormPage/Inputs/FormRadio';
import { useContext } from 'react';
import {
    ActionPicker,
    NameField,
    TimeField,
} from '@app/pages/FormPage/Inputs/CruiseDetailsTables/EquipmentLeaveTableFields';
import {
    BottomMenuSingleSelect,
    BottomMenuWithHistory,
    OrdinalNumber,
    RemoveRowButton,
} from '@app/pages/FormPage/Inputs/TableParts';
import { FieldValues } from 'react-hook-form';
import { FieldTableWrapper } from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import { fileExists } from '@app/pages/FormPage/Inputs/ContractsTable/ContractsTable';
import { FormContext } from '@contexts/FormContext';
import { FieldContext } from '@contexts/FieldContext';
import { notEmptyArray } from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';


export type EquipmentLeave = {
    action: string,
    time: string,
    name: string
}

const equipmentLeaveDefault = [{
    action: 'leaving',
    time: '',
    name: '',
},
    {
        action: 'taking',
        time: '',
        name: '',
    }];

export const equipmentLeaveActions = [
    'leaving',
    'taking',
];

export const equipmentLeaveActionsPL = [
    'Pozostawienie',
    'Zabranie',
];

export const equipmentLeaveOptions = equipmentLeaveActionsPL.map((taskLabel, index) =>
    ({ label: taskLabel, value: equipmentLeaveDefault[index] }));

type EquipmentLeaveTableProps = FieldProps &
    { historicalEquipmentLeave?: EquipmentLeave[] }

const EquipmentLeaveRowLabel = (row: EquipmentLeave) =>
    `Czynność: ${row.action}\n
    Czas: ${row.time}\n
    Nazwa sprzętu: ${row.name}\n`;


const EquipmentLeaveTableContent = () => {
    const formContext = useContext(FormContext);

    return [
        () => (<OrdinalNumber label={'Sprzęt'} />),
        ActionPicker,
        TimeField,
        NameField,
        RemoveRowButton,
    ];
};

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function EquipmentLeaveTable(props: EquipmentLeaveTableProps) {


    const formContext = useContext(FormContext);

    const FilteredHistoricalEquipmentLeave = (action: string) =>
        props.historicalEquipmentLeave?.filter((row) => row.action == action)
            .map((row: EquipmentLeave) =>
                ({ label: EquipmentLeaveRowLabel(row), value: row })) ?? [];

    const selectOptions = equipmentLeaveActions.map((equipmentLeaveCategory, index) =>
        ({
            label: equipmentLeaveActionsPL[index],
            options: FilteredHistoricalEquipmentLeave(equipmentLeaveCategory),
        })) ?? [];

    const mdColWidths = [5, 20, 30, 40, 5];
    const mdColTitles = ['Lp.', 'Czynność', 'Czas (pora dnia, przedział czasu itp.)', 'Nazwa sprzętu', ''];
    const colTitle = 'Pozostawienie lub zabranie sprzętu';
    const bottomMenu =
        <BottomMenuSingleSelect options={equipmentLeaveOptions} />;
    const emptyText = 'Nie dodano żadnego sprzętu';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, EquipmentLeaveTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<EquipmentLeave>,
            },
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default EquipmentLeaveTable;
