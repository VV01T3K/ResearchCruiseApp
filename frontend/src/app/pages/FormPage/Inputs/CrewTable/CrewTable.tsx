import { FieldProps } from '@app/pages/FormPage/Inputs/FormRadio';
import { useContext } from 'react';
import { InstitutionField, PersonalDataColumn } from '@app/pages/FormPage/Inputs/CrewTable/CrewTableFields';
import {
    BottomMenuWithAddButtonAndHistory,
    OrdinalNumber,
    RemoveRowButton,
} from '@app/pages/FormPage/Inputs/TableParts';
import { FieldValues } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { FieldTableWrapper } from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import { fileExists } from '@app/pages/FormPage/Inputs/ContractsTable/ContractsTable';
import { FormContext } from '@contexts/FormContext';
import { FieldContext } from '@contexts/FieldContext';
import { notEmptyArray } from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';


export type Crew = {
    title: string,
    names: string,
    surname: string,
    birthPlace: string,
    birthDate: string,
    ID: string,
    expiryDate: string,
    institution: string
}

const crewDefault = {
    title: '',
    names: '',
    surname: '',
    birthPlace: '',
    birthDate: '',
    ID: '',
    expiryDate: '',
    institution: '',
};


type CrewTableProps = FieldProps &
    { historicalCrew?: Crew[] }

const CrewRowLabel = (row: Crew) =>
    `Tytuł: ${row.title}\n
    Imiona: ${row.names}\n
    Nazwisko: ${row.surname}\n
    Miejsce urodzenia: ${row.birthPlace}\n
    Data urodzenia: ${row.birthDate}\n
    Numer ID: ${row.ID}\n
    Data ważności dokumentu: ${row.expiryDate}`;

const crewTableContent = () => {
    const formContext = useContext(FormContext);

    return [
        () => (<OrdinalNumber label={'Członek załogi'} />),
        PersonalDataColumn,
        InstitutionField,
        RemoveRowButton,
    ];
};

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function CrewTable(props: CrewTableProps) {


    const formContext = useContext(FormContext);

    const selectOptions = props.historicalCrew?.map((row: Crew) =>
        ({ label: CrewRowLabel(row), value: row })) ?? [];


    const mdColWidths = [5, 45, 45, 5];
    const mdColTitles = ['Lp.', 'Dane osobowe', 'Nazwa jednostki organizacyjnej UG lub instytucji zewnętrznej', ''];
    const colTitle = 'Lista uczestników rejsu';
    const bottomMenu =
        <BottomMenuWithAddButtonAndHistory newOption={crewDefault as SingleValue<any>}
                                           historicalOptions={selectOptions} />;
    const emptyText = 'Nie dodano żadnego członka załogi';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, crewTableContent,
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


export default CrewTable;
