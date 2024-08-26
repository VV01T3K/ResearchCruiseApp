import React, {useContext} from "react";
import {SelectOptions, SelectSingleValue, SelectWrapper} from "../Wrappers/ReactSelectWrapper";
import {FormContext} from "../Wrappers/FormTemplate";
import {CellContext, FieldContext, KeyContext} from "../Wrappers/FieldTableWrapper";
import {ReactComponent as RemoveIcon} from "/node_modules/bootstrap-icons/icons/x-lg.svg";

import useWindowWidth from "../../../CommonComponents/useWindowWidth";

export const RemoveRow = () => {
    const fieldContext = useContext(FieldContext)
    const cellContext = useContext(CellContext)
    const formContext = useContext(FormContext)
    return () => {
        var newValue = fieldContext!.field.value
        newValue.splice(cellContext!.rowIndex, 1)
        formContext!.trigger(fieldContext!.fieldName)
    }
}

export const CreateRow = ()=> {
    const formContext = useContext(FormContext)
    const fieldContext = useContext(FieldContext)
    return (selectedOption: SelectSingleValue) => {
        var newValue = [...fieldContext!.field.value, {...selectedOption!.value}]
        fieldContext!.field.onChange(newValue)
        formContext!.trigger(fieldContext!.fieldName)
    }
}

export const CreateRowWithButton = ()=> {
    const formContext = useContext(FormContext)
    const fieldContext = useContext(FieldContext)
    return (newRow:any) => {
        var newValue = [...fieldContext!.field.value, {...newRow}]
        fieldContext!.field.onChange(newValue)
        formContext!.trigger(fieldContext!.fieldName)
    }
}

export const NewRowSelect = (props:{options:SelectOptions, className?:string}) => {
    const createRow = CreateRow()
    return(
        <SelectWrapper className={"table-field-bottom-menu-button "+props.className}
            // isDisabled={formContext!.formState?.errors && formContext!.formState?.errors[props.fieldName]}
                       placeHolder="Dodaj nowe"
                       classNamePrefix={"select-primary"}
                       options ={props.options}
                       onChange={createRow}
        />
    )
}

export const NewRowButton = (props:{option:SelectOptions, className?:string}) => {
    const createRowWithButton = CreateRowWithButton()
    return(
    <div className={"btn btn-primary text-center " + props.className}  onClick={() => createRowWithButton(props.option)}>
        Dodaj
    </div>
    )
}

export const RowFromHistorySelect = (props: { options: SelectOptions, className?:string }) => {
    const createRow = CreateRow()
    return(
        <SelectWrapper className={"table-field-bottom-menu-button " + props.className}
            // isDisabled={formContext!.formState?.errors && formContext!.formState?.errors[props.fieldName]}
                       placeHolder="Dodaj z historii"
                       options ={props.options}
                       classNamePrefix={"select"}
            onChange={createRow}
        />
    )
}

export const BottomMenu = (props:{children?:React.ReactElement | React.ReactElement[], className?:string}) => {
    const formContext = useContext(FormContext)

    return(
        <div className={props.className + (formContext!.readOnly ? " table-field-bottom-menu-readonly" : " table-field-bottom-menu")}
>
            {props.children}
        </div>
    )
}



export const BottomMenuWithHistory = (props: { newOptions: SelectOptions, historicalOptions: SelectOptions }) =>
    (
        <BottomMenu>
            <NewRowSelect className={"col-12 col-md-6"} options={props.newOptions}/>
            <RowFromHistorySelect className={"col-12 col-md-6"} options={props.historicalOptions}/>
        </BottomMenu>
    )

export const BottomMenuSingleSelect = (props: { options: SelectOptions }) =>
    (
        <BottomMenu>
            <NewRowSelect className={"col-12"} options={props.options}/>
        </BottomMenu>
    )

export const BottomMenuWithAddButtonAndHistory = (props: { newOption: SelectOptions, historicalOptions: SelectOptions }) =>
    (
        <BottomMenu className={"align-items-center"}>
            <NewRowButton className={"col-12 col-md-6"} option={props.newOption}/>
            <RowFromHistorySelect className={"col-12 col-md-6"} options={props.historicalOptions}/>
        </BottomMenu>
    )


export const CellTools = () => {
    const cellContext = useContext(CellContext)
    const fieldContext = useContext(FieldContext)
    const keyContext = useContext(KeyContext)
    const rowValue = fieldContext!.field.value[cellContext!.rowIndex]
    // console.log(rowValue)
    const cellValue = rowValue[keyContext!]
    function setCellValue (e: any){
        fieldContext!.field.value[cellContext!.rowIndex][keyContext!] = e;
        fieldContext!.field.onChange(fieldContext!.field.value)
    }

    function setCellValueOnBlur (e: any){
        setCellValue(e)
        fieldContext!.field.onBlur(fieldContext!.field.value)

    }

    const cellId = `${fieldContext?.fieldName}.${cellContext?.rowIndex}.${cellContext?.colIndex}.`

    const field = fieldContext!.field
    return {cellValue, rowValue, setCellValue, setCellValueOnBlur, field, cellId}
}

export const RemoveRowButton = () => {
    const formContext = useContext(FormContext)
    const removeRow = RemoveRow()
    return (
        <>
            {!formContext!.readOnly &&
                <div className={"border rounded p-1"}>
                    <RemoveIcon type="button" onClick={removeRow}/>
                </div>
            }
        </>
    )
}

export const OrdinalNumber = (props:{label:string}) => {
    const windowWidth = useWindowWidth()
    const cellContext = useContext(CellContext)

    return(
        <b>{windowWidth < 720 ? props.label : ""} {cellContext!.rowIndex + 1}.</b>
    )
}