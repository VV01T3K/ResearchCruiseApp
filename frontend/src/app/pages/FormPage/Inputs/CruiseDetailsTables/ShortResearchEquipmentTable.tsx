import {SingleValue} from 'react-select';
import {FieldTableWrapper} from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import {FormContext} from '@contexts/FormContext';
import {FieldProps} from '@app/pages/FormPage/Inputs/FormRadio';
import {useContext} from 'react';
import {BottomMenuWithAddButton, OrdinalNumber, RemoveRowButton} from '@app/pages/FormPage/Inputs/TableParts';
import {
    EndDateField,
    NameField,
    StartDateField,
} from '@app/pages/FormPage/Inputs/CruiseDetailsTables/EquipmentOutsideTableFields';
import {FieldValues} from 'react-hook-form';
import {notEmptyArray} from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';
import {FieldContext} from '@contexts/FieldContext';
import {ShortResearchEquipement} from 'ShortResearchEquipement';
import {shortResearchEquipementDefaul} from '@helpers/shortResearchEquipementDefault';


type EquipmentOutsideTableProps = FieldProps &
    { historicalEquipmentOutside?: ShortResearchEquipement[] }

const EquipmentOutsideTableContent = () => [
    () => (<OrdinalNumber label={'Sprzęt'} />),
    StartDateField,
    EndDateField,
    NameField,
    RemoveRowButton,
];

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function ShortResearchEquipmentTable(props: EquipmentOutsideTableProps) {


    const formContext = useContext(FormContext);

    const mdColWidths = [5, 20, 20, 50, 5];
    const mdColTitles = ['Lp.', 'Od', 'Do', 'Nazwa sprzętu', ''];
    const colTitle = 'Wystawienie sprzętu';
    const bottomMenu =
        <BottomMenuWithAddButton newOption={shortResearchEquipementDefaul as SingleValue<any>}
        />;
    const emptyText = 'Nie dodano żadnego sprzętu';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, EquipmentOutsideTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<ShortResearchEquipement>,
                rightDatePeriod: (value: ShortResearchEquipement[]) => {
                    if (value.some((row: ShortResearchEquipement) => row.startDate >= row.endDate)) {
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


export default ShortResearchEquipmentTable;
