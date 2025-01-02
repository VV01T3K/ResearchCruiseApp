import {FieldProps} from '@app/pages/FormPage/Inputs/FormRadio';
import {useContext} from 'react';
import {FormContext} from '@contexts/FormContext';
import {BottomMenuWithAddButton, RemoveRowButton} from '@app/pages/FormPage/Inputs/TableParts';
import {
    DayField,
    HoursField,
    NotesField,
    PositionField,
    RegionField,
    TaskNameField,
} from '@app/pages/FormPage/Inputs/DetailedPlanTable/DetailedPlanTableFields';
import {FieldValues} from 'react-hook-form';
import {FieldContext} from '@contexts/FieldContext';
import {SingleValue} from 'react-select';
import {FieldTableWrapper} from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import {notEmptyArray} from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';
import {DetailedPlan} from 'DetailedPlan';
import {detailedPlanDefault} from '@helpers/detailedPlanDefault';


type DetailedPlanProps = FieldProps


const detailedPlanTableContent = () => {
    return [
        DayField,
        HoursField,
        TaskNameField,
        RegionField,
        PositionField,
        NotesField,
        RemoveRowButton,
    ];
};

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function DetailedPlanTable(props: DetailedPlanProps) {


    const formContext = useContext(FormContext);


    const mdColWidths = [10, 14, 17, 18, 18, 18, 5];
    const mdColTitles = ['Dzień', 'Liczba godzin', 'Nazwa zadania', 'Rejon zadania', 'Pozycja', 'Uwagi', ''];
    const colTitle = 'Plan rejsu';
    const bottomMenu =
        <BottomMenuWithAddButton newOption={detailedPlanDefault as SingleValue<any>} />;
    const emptyText = 'Nie dodano żadnego dnia';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, detailedPlanTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<DetailedPlan>,
            },
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default DetailedPlanTable;
