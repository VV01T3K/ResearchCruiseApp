import { FieldProps } from '@app/pages/FormPage/Inputs/FormRadio';
import { useContext } from 'react';
import { InsuranceColumn, PermissionField } from '@app/pages/FormPage/Inputs/EquipmentTable/EquipmentTableFields';
import { BottomMenuWithAddButton, OrdinalNumber, RemoveRowButton } from '@app/pages/FormPage/Inputs/TableParts';
import { FieldValues } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { FieldTableWrapper } from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import { fileExists } from '@app/pages/FormPage/Inputs/ContractsTable/ContractsTable';
import { FormContext } from '@contexts/FormContext';
import { NameField } from '@app/pages/FormPage/Inputs/SpubTasksTable';
import { FieldContext } from '@contexts/FieldContext';
import { notEmptyArray } from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';
import { Crew } from '@app/pages/FormPage/Inputs/CrewInput';

export type Equipment = {
    startDate: string,
    endDate: string,
    name: string,
    insurance: boolean,
    permission: boolean
}

const equipmentDefault = {
    startDate: '',
    endDate: '',
    name: '',
    insurance: false,
    permission: false,
};

type EquipmentProps = FieldProps


const equipmentTableContent = () => {
    const formContext = useContext(FormContext);

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
    const mdColTitles = ['Lp.', 'Nazwa sprzętu / aparatury', 'Zgłoszenie do ubezpieczenia', 'Czy uzyskano zgodę opiekuna', ''];
    const colTitle = 'Lista uczestników rejsu';
    const bottomMenu =
        <BottomMenuWithAddButton newOption={equipmentDefault as SingleValue<any>} />;
    const emptyText = 'Nie dodano żadnego sprzętu';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, equipmentTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<Crew>,
                fileExists: fileExists,
            },
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default EquipmentTable;
