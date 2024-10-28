import React, { useContext } from 'react';
import { FormContext } from '@contexts/FormContext';
import { BottomMenuSingleSelect, BottomMenuWithAddButton } from '@app/pages/FormPage/Inputs/TableParts';
import { FieldTableWrapper } from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import { FieldValues } from 'react-hook-form';
import { FieldContext } from '@contexts/FieldContext';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';
import { InitContext, UgTeam, UgUnit } from '@app/pages/FormPage/Inputs/UgTeamsTable/UgTeamsTable';
import { FormField } from '@app/pages/FormPage/Inputs/FormYearSelect';
import { TechnicalElements } from '@app/pages/FormPage/Inputs/TechnicalElementsUsedInput';
import { SingleValue } from 'react-select';
import { FieldContextWrapper } from '@app/pages/FormPage/Inputs/TechnicalElementsTable/TechnicalElementsTable';
import { ElementsColumn } from '@app/pages/FormPage/Inputs/TechnicalElementsTable/TechnicalElementsTableFields';
import { CellContext } from '@contexts/CellContext';
import { KeyContext } from '@contexts/KeyContext';

export type TechnicalElement = {}

type Props = FormField & {
    initValues?: TechnicalElement[]
}

const TechnicalElementsTools = () => {
    const cellContext = useContext(CellContext);
    const fieldContext = useContext(FieldContext);
    const initContext = useContext(InitContext);
    const rowValue = initContext[cellContext!.rowIndex];

    function isChecked() {
        return fieldContext!.value.includes(rowValue?.id);
    }

    function setCellValueOnBlur(checked: boolean) {
        var text: any[];
        if (checked && !isChecked()) {
            const text = [...fieldContext!.value];
            text.push(rowValue.id);
            fieldContext!.onChange(text);
        } else if (isChecked()) {
            text = [...fieldContext!.value];

            fieldContext!.onChange(
                text.filter(row => {
                    return row !== rowValue.id;
                }));

        }

    }

    const field = fieldContext;
    return {
        isChecked,
        rowValue,
        setCellValueOnBlur,
        field,
    };
};


const TechnicalElement = () => {
    const { rowValue } = TechnicalElementsTools();
    return (
        <div>{rowValue.name}</div>
    );
};

const Checkbox = () => {
    const formContext = useContext(FormContext);
    const { isChecked, setCellValueOnBlur } = TechnicalElementsTools();
    return (
        <input disabled={formContext!.readOnly} className={'w-100'} type={'checkbox'} checked={isChecked()}
               onChange={(e) =>
                   setCellValueOnBlur(e.target.checked)} />
    );
};


const technicalElementsTableContent = () => [
    TechnicalElement,
    Checkbox,
];

const ListWithCheckbox = (props: Props) => {

    const mdColTitles = ['Element', 'W użyciu'];
    const colTitle = 'Elementy';
    const mdColWidths = [70, 30];
    const emptyText = 'Nie dodano żadnych elementów';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, technicalElementsTableContent,
        null, emptyText, props.initValues);


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <InitContext.Provider value={props.initValues!}>
            <FieldWrapper {...fieldProps} />
        </InitContext.Provider>
    );
};

export default ListWithCheckbox;