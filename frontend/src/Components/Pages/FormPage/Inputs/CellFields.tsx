import DatePicker from "react-datepicker";
import React, {useContext} from "react";
import {datePickerCommon, datePickerPeriodCommon} from "./DatePickerCommon";
import {ParseIntInput} from "./Misc";
import TextareaAutosize from "react-textarea-autosize";
import {CellTools} from "./TableParts";
import {SelectOptions, SelectSingleValue, SelectWrapper} from "../Wrappers/ReactSelectWrapper";
import {ReadOnlyContext} from "../Wrappers/FormTemplate";

export const StandardDateField = (props:{className?:string}) => {
    const {cellValue, setCellValue, field} = CellTools()
    const readOnlyContext = useContext(ReadOnlyContext)
    return(
        <DatePicker
            disabled={readOnlyContext!}
            className={"field-common " + props.className}
            {...field} {...datePickerCommon}
            selected={cellValue ? new Date(cellValue) : null}
            onChange={(e)=>setCellValue(e?.toISOString())}
        />
    )
}

export const DateFieldOnlyYear = (props:{className?:string}) => {
    const {cellValue, setCellValue, field} = CellTools()
    const readOnlyContext = useContext(ReadOnlyContext)
    return(
        <DatePicker
            disabled={readOnlyContext!}
            dateFormat="yyyy"
            showYearPicker
            className={"field-common w-100 " + props.className}
            {...field} {...datePickerCommon}
            selected={cellValue ? new Date(cellValue, 0) : null}
            onChange={(e)=>setCellValue(e?.getFullYear())}
        />
    )
}

export const DateFieldEnd = (props:{className?:string}) => {
    const {cellValue, rowValue, setCellValue, field} = CellTools()
    const readOnlyContext = useContext(ReadOnlyContext)
    return(
        <DatePicker
            disabled={readOnlyContext!}
            className={"field-common " + props.className}
            startDate={rowValue.startDate ? new Date(rowValue.startDate) : undefined}
            endDate={cellValue ? new Date(cellValue) : undefined}
            minDate={rowValue.startDate ? new Date(rowValue.startDate) : undefined}
            selectsEnd
            {...field} {...datePickerPeriodCommon}
            selected={cellValue}
            onChange={(e)=>setCellValue(e?.toString())}
        />
    )
}

export const DateFieldStart = (props:{className?:string}) => {
    const {cellValue, rowValue, setCellValue, field} = CellTools()
    const readOnlyContext = useContext(ReadOnlyContext)

    return(
        <DatePicker
            disabled={readOnlyContext!}
            className={"field-common " + props.className}
            endDate={rowValue.endDate ? new Date(rowValue.endDate) : undefined}
            startDate={cellValue ? new Date(cellValue  as string) : undefined}
            maxDate={rowValue.endDate ? new Date(rowValue.endDate) : undefined}
            selectsStart
            {...field} {...datePickerPeriodCommon}
            selected={cellValue}
            onChange={(e)=>setCellValue(e?.toString())}
        />
    )
}

export const FloatField = (props:{className?:string}) => {
    const {cellValue, setCellValue, field} = CellTools()
    const onBlur = FloatInputOnBlur
    const readOnlyContext = useContext(ReadOnlyContext)
    return (
        <input
            disabled={readOnlyContext!}
            className={"field-common " + props.className}
               inputMode="numeric"
               {...field}
               value={cellValue}
               onChange={(e)=>{setCellValue(e.target.value)}}
               onBlur={onBlur}
               placeholder="0"
        />
    )
}

export const IntInputOnBlur = () => {
    const {setCellValue, field} = CellTools()
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        setCellValue(String(ParseIntInput(e.target.value)))
        field.onBlur(field.value)
    }
}

export const FloatInputOnBlur = () => {
    const {setCellValue, field} = CellTools()

    return (e: React.ChangeEvent<HTMLInputElement>) => {
        setCellValue(String(ParseIntInput(e.target.value)))
        field.onBlur(field.value)
    }

}

export const IntField = (props:{className?:string}) => {
    const {cellValue, setCellValue, field} = CellTools()
    const onBlur = IntInputOnBlur()
    const readOnlyContext = useContext(ReadOnlyContext)
    return (
        <input className={"field-common " + props.className}
               disabled={readOnlyContext!}
               inputMode="numeric"
               {...field}
               value={cellValue}
               onChange={(e)=>{setCellValue(e.target.value)}}
               onBlur={onBlur}
               placeholder="0"
        />
    )
}

export const TextField = (props:{className?:string}) => {
    const {cellValue, setCellValue, field} = CellTools()
    const readOnlyContext = useContext(ReadOnlyContext)
    return(
        <TextareaAutosize
            disabled={readOnlyContext!}
            className={"field-common " + props.className}
                         {...field}
                          value={cellValue}
                          onChange={(e)=>setCellValue(e.target.value)}
        />
    )
}

export const SelectField = (props:{className?:string, options:SelectOptions}) => {
    const {cellValue, setCellValue, field} = CellTools()
    return(
        <SelectWrapper value={props.options!.find((option)=>
            (option as SelectSingleValue)!.value == cellValue)} options={props.options}
                       onChange={(e)=>setCellValue(e?.value)}/>
    )
}
