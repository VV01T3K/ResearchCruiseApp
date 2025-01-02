import {useContext} from 'react';
import {FieldValues} from 'react-hook-form';
import {BottomMenuWithHistory, OrdinalNumber, RemoveRowButton} from '../TableParts';
import {FieldProps} from '../FormRadio';
import {FieldTableWrapper} from '../../Wrappers/FieldTableWrapper';
import FieldWrapper from '../FieldWrapper';
import {CategoryPicker, InformationsColumn, MinisterialPointsField, YearField} from './PublicationsTableFields';
import {FieldContextWrapper} from '../PermissionsTable/PermissionsTable';
import {FormContext} from '@contexts/FormContext';

export const notEmptyArray = <T extends object>(value: FieldValues) => {
    if (value.some((row: T) => {
        return Object.values(row).some(field => {
                return !field;
            },
        );
    })) {
        return 'Wypełnij wszystkie pola';
    }
};

export type Publication = {
    category: string,
    doi: string,
    authors: string,
    title: string,
    magazine: string,
    year: string,
    ministerialPoints: string
}

const publicationDefaultValues = [
    {
        category: 'subject',
        doi: '',
        authors: '',
        title: '',
        magazine: '',
        year: '0',
        ministerialPoints: '0',
    },
    {
        category: 'postscript',
        doi: '',
        authors: '',
        title: '',
        magazine: '',
        year: '0',
        ministerialPoints: '0',
    }];

export const publicationCategories = [
    'subject',
    'postscript',
];

export const publicationCategoriesPL = [
    'Temat',
    'Dopisek',
];


export const publicationOptions = publicationCategoriesPL.map((taskLabel, index) =>
    ({ label: taskLabel, value: publicationDefaultValues[index] }));

const PublicationTableContent = () =>
    [
        () => (<OrdinalNumber label={'Publikacja'} />),
        CategoryPicker,
        InformationsColumn,
        YearField,
        MinisterialPointsField,
        RemoveRowButton,
    ];

type PublicationsTableProps = FieldProps &
    { historicalPublications?: Publication[] }

const PublicationRowLabel = (row: Publication) =>
    `DOI: ${row.doi}\n
    Autorzy: ${row.authors}\n
    Tytuł: ${row.title}\n
    Czasopismo: ${row.magazine}\n
    Rok wydania: ${row.year}\n
    Punkty: ${row.ministerialPoints}`;


export const PublicationsTable = (props: PublicationsTableProps) => {

    const formContext = useContext(FormContext);

    const FilteredHistoricalPublications = (category: string) =>
        props.historicalPublications?.filter((row) => row.category == category)
            .map((row: Publication) =>
                ({ label: PublicationRowLabel(row), value: row })) ?? [];

    const selectOptions = publicationCategories.map((publicationCategory, index) =>
        ({
            label: publicationCategoriesPL[index],
            options: FilteredHistoricalPublications(publicationCategory),
        })) ?? [];


    const mdColWidths = [5, 15, 51, 10, 14, 5];
    const mdColTitles = ['Lp.', 'Kategoria', 'Informacje', 'Rok wydania', 'Punkty ministerialne', ''];
    const colTitle = 'Publikacje';
    const bottomMenu =
        <BottomMenuWithHistory newOptions={publicationOptions} historicalOptions={selectOptions} />;
    const emptyText = 'Nie dodano żadnej publikacji';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, PublicationTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: { notEmptyArray: notEmptyArray<Publication> },
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
};

export default PublicationsTable;