import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import pl from "date-fns/locale/pl"; // the locale you want
import {FieldValues,} from "react-hook-form";
import React, {useContext} from "react";
import FieldWrapper from "./FieldWrapper";
import {FormContext} from "../Wrappers/FormTemplate";
import {FieldProps} from "./FormRadio";
import {datePickerCommon, datePickerPeriodCommon} from "./DatePickerCommon";

registerLocale("pl", pl); // register it with the name you want


type StartDateFieldProps = FieldProps & {
    EndDateFieldName:string
}

type EndDateFieldProps = FieldProps & {
    StartDateFieldName:string
}

export function StartDateField(props: StartDateFieldProps) {

    const formContext = useContext(FormContext)
    const endDateValue = formContext?.getValues(props.EndDateFieldName)
    const render = ({field}:FieldValues) => {
        return(
            <DatePicker
                {...field}
                className={"field-common w-100"}
                disabled={formContext!.readOnly ?? false}
                onChange={(e: Date)=> {
                    if (e != null) {
                        field.onChange(e.toISOString())
                    }
                }}
                showTimeSelect
                {...datePickerCommon}
                endDate={endDateValue ? new Date(endDateValue) : undefined}
                startDate={field.value ? new Date(field.value as string) : undefined}
                maxDate={endDateValue ? new Date(endDateValue) : undefined}
                selectsStart
                value={field.value ? new Date(field.value):undefined}
                selected={field.value ? new Date(field.value):undefined}
                dateFormat="Pp"
            />
        )
    }

    const fieldProps = {
        ...props,
        rules: {required: 'Data nie może być pusta'},
        render: render
    }

    return ( <FieldWrapper {...fieldProps}/> )
}

export function EndDateField(props: EndDateFieldProps) {

    const formContext = useContext(FormContext)
    const startDateValue = formContext?.getValues(props.StartDateFieldName)

    const render = ({field}:FieldValues) => {
        return(
            <DatePicker
                {...field}
                className={"field-common w-100"}
                disabled={formContext!.readOnly ?? false}
                onChange={(e: Date)=> {
                    if (e != null) {
                        field.onChange(e.toISOString())
                    }
                }}
                {...datePickerCommon}
                startDate={startDateValue ? new Date(startDateValue) : undefined}
                endDate={field.value ? new Date(field.value) : undefined}
                minDate={startDateValue ? new Date(startDateValue) : undefined}
                selectsEnd
                showTimeSelect
                value={field.value ? new Date(field.value):undefined}
                selected={field.value ? new Date(field.value):undefined}
                dateFormat="Pp"
            />
        )
    }

    const fieldProps = {
        ...props,
        rules: {required: 'Data nie może być pusta'},
        render: render
    }

    return ( <FieldWrapper {...fieldProps}/> )
}



