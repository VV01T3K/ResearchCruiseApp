import React, {useContext} from 'react';
import {SelectOptions, SelectSingleValue, SelectWrapper,} from '../Wrappers/ReactSelectWrapper';
import RemoveIcon from 'bootstrap-icons/icons/x-lg.svg?react';

import useWindowWidth from '../../../../hooks/useWindowWidth';
import {DisplayContext} from './TaskTable/EvaluatedTaskTable';
import {FormContext} from '@contexts/FormContext';
import {ReadOnlyContext} from '@contexts/ReadOnlyContext';
import {FieldContext} from '@contexts/FieldContext';
import {CellContext} from '@contexts/CellContext';
import {KeyContext} from '@contexts/KeyContext';

export const RemoveRow = () => {
    const fieldContext = useContext(FieldContext);
    const cellContext = useContext(CellContext);
    const formContext = useContext(FormContext);

    return () => {
        fieldContext!.value.splice(cellContext!.rowIndex, 1);
        fieldContext!.onBlur();
        formContext!.trigger(fieldContext!.name);
    };
};

export const CreateRow = () => {
    const formContext = useContext(FormContext);
    const fieldContext = useContext(FieldContext);

    return (selectedOption: SelectSingleValue) => {

        const newValue = [
            ...fieldContext!.value,
            { ...(selectedOption!.value as Array<any>) },
        ];
        fieldContext!.onChange(newValue);
        formContext!.trigger(fieldContext!.name);
    };
};

export const CreateRowWithButton = () => {
    const formContext = useContext(FormContext);
    const fieldContext = useContext(FieldContext);
    return (newRow: any) => {
        const newValue = [...fieldContext!.value, { ...newRow }];
        fieldContext!.onChange(newValue);
        formContext!.trigger(fieldContext!.name);
    };
};

export const NewRowSelect = (props: {
    options: SelectOptions;
    className?: string;
}) => {
    const createRow = CreateRow();
    return (
        <SelectWrapper
            className={'table-field-bottom-menu-button ' + props.className}
            // isDisabled={formContext!.formState?.errors && formContext!.formState?.errors[props.fieldName]}
            placeHolder="Dodaj nowe"
            classNamePrefix={'select-primary'}
            options={props.options}
            onChange={createRow}
        />
    );
};

export const NewRowButton = (props: {
    option: SelectOptions;
    className?: string;
}) => {
    const createRowWithButton = CreateRowWithButton();
    return (
        <div
            className={'btn btn-primary text-center ' + props.className}
            onClick={() => createRowWithButton(props.option)}
        >
            Dodaj
        </div>
    );
};

export const RowFromHistorySelect = (props: {
    options: SelectOptions;
    className?: string;
}) => {
    const createRow = CreateRow();
    return (
        <SelectWrapper
            className={'table-field-bottom-menu-button ' + props.className}
            // isDisabled={formContext!.formState?.errors && formContext!.formState?.errors[props.fieldName]}
            placeHolder="Dodaj z historii"
            options={props.options}
            classNamePrefix={'select'}
            onChange={createRow}
        />
    );
};

export const BottomMenu = (props: {
    children?: React.ReactElement | React.ReactElement[];
    className?: string;
}) => {
    const formContext = useContext(FormContext);

    return (
        <div
            className={
                props.className +
                (formContext!.readOnly
                    ? ' table-field-bottom-menu-readonly'
                    : ' table-field-bottom-menu')
            }
        >
            {props.children}
        </div>
    );
};

export const BottomMenuWithHistory = (props: {
    newOptions: SelectOptions;
    historicalOptions: SelectOptions;
}) => (
    <BottomMenu>
        <NewRowSelect className={'col-12 col-md-6'} options={props.newOptions} />
        <RowFromHistorySelect
            className={'col-12 col-md-6'}
            options={props.historicalOptions}
        />
    </BottomMenu>
);

export const BottomMenuSingleSelect = (props: { options: SelectOptions }) => (
    <BottomMenu>
        <NewRowSelect className={'col-12'} options={props.options} />
    </BottomMenu>
);

export const BottomMenuWithAddButtonAndHistory = (props: {
    newOption: any;
    historicalOptions: SelectOptions;
}) => (
    <BottomMenu className={'align-items-center'}>
        <NewRowButton className={'col-12 col-md-6'} option={props.newOption} />
        <RowFromHistorySelect
            className={'col-12 col-md-6'}
            options={props.historicalOptions}
        />
    </BottomMenu>
);

export const BottomMenuWithAddButton = (props: {
    newOption: SelectOptions;
}) => (
    <BottomMenu className={'align-items-center'}>
        <NewRowButton className={'col-12'} option={props.newOption} />
    </BottomMenu>
);

export const CellFormTools = () => {
    const cellContext = useContext(CellContext);
    const fieldContext = useContext(FieldContext);
    const keyContext = useContext(KeyContext);
    const rowValue = fieldContext!.value[cellContext!.rowIndex];
    const cellValue = rowValue ? rowValue[keyContext!] : null;

    function setCellValue(e: any) {
        fieldContext!.value[cellContext!.rowIndex][keyContext!] = e;
        fieldContext!.onChange(fieldContext!.value);
    }

    function setCellValueOnBlur(e: any) {
        setCellValue(e);
        fieldContext!.onBlur(fieldContext!.value);
    }

    const cellId = `${fieldContext?.name}.${cellContext?.rowIndex}.${cellContext?.colIndex}.`;

    const field = fieldContext;
    return {
        cellValue,
        rowValue,
        setCellValue,
        setCellValueOnBlur,
        field,
        cellId,
    };
};

export const CellTools = () => {
    const cellContext = useContext(CellContext);
    const keyContext = useContext(KeyContext);
    const displayContext = useContext(DisplayContext);
    const fieldContext = useContext(FieldContext); //used only for id

    const rowValue = displayContext[cellContext!.rowIndex];
    const cellValue = rowValue[keyContext!];

    const cellId = `${fieldContext?.name}.${cellContext?.rowIndex}.${cellContext?.colIndex}.`;

    return { cellValue, rowValue, cellId };
};

export const RemoveRowButton = () => {
    const readOnly = useContext(ReadOnlyContext);
    const removeRow = RemoveRow();
    return (
        <>
            {!readOnly && (
                <div
                    className={
                        'btn-danger btn rounded align-items-center justify-content-center d-flex p-2'
                    }
                    onClick={removeRow}
                >
                    <RemoveIcon type="button" />
                </div>
            )}
        </>
    );
};

export const OrdinalNumber = (props: { label: string }) => {
    const windowWidth = useWindowWidth();
    const cellContext = useContext(CellContext);

    return (
        <b>
            {windowWidth < 720 ? props.label : ''} {cellContext!.rowIndex + 1}.
        </b>
    );
};
