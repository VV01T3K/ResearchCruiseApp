import { FieldProps } from '@app/pages/FormPage/Inputs/FormRadio';
import { useContext } from 'react';
import { FormContext } from '@contexts/FormContext';
import {
    BottomMenuWithAddButtonAndHistory,
    OrdinalNumber,
    RemoveRowButton,
} from '@app/pages/FormPage/Inputs/TableParts';
import {
    EntranceDateField,
    ExitDateField,
    NameField,
} from '@app/pages/FormPage/Inputs/CruiseDetailsTables/PortTableFields';
import { FieldValues } from 'react-hook-form';
import { FieldContext } from '@contexts/FieldContext';
import { FieldTableWrapper } from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import { SingleValue } from 'react-select';
import { notEmptyArray } from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';
import { fileExists } from '@app/pages/FormPage/Inputs/ContractsTable/ContractsTable';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';


export type Port = {
    entranceDate: string,
    exitDate: string,
    name: string
}

const portDefault = {
    entranceDate: '',
    exitDate: '',
    name: '',
};

type PortTableProps = FieldProps &
    { historicalPorts?: Port[] }

const PortRowLabel = (row: Port) =>
    `Od: ${row.entranceDate}\n
    Do: ${row.exitDate}\n
    Nazwa sprzętu: ${row.name}\n`;


const PortTableContent = () => {
    const formContext = useContext(FormContext);

    return [
        () => (<OrdinalNumber label={'Sprzęt'} />),
        EntranceDateField,
        ExitDateField,
        NameField,
        RemoveRowButton,
    ];
};

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function PortTable(props: PortTableProps) {


    const formContext = useContext(FormContext);

    const selectOptions = props.historicalPorts?.map((row: Port) =>
        ({ label: PortRowLabel(row), value: row })) ?? [];

    const mdColWidths = [5, 30, 30, 30, 5];
    const mdColTitles = ['Lp.', 'Wejście', 'Wyjście', 'Nazwa portu', ''];
    const colTitle = '';
    const bottomMenu =
        <BottomMenuWithAddButtonAndHistory newOption={portDefault as SingleValue<any>}
                                           historicalOptions={selectOptions} />;
    const emptyText = 'Nie dodano żadnego sprzętu';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, PortTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<Port>,
                fileExists: fileExists,
            },
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default PortTable;
