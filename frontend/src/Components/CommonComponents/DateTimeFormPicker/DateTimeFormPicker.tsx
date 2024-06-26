import DatePicker from "react-datepicker";
import React, {Dispatch, useEffect, useState} from "react"

import "./DateTimeFormPicker.css"
import {Controller, UseFormReturn, useWatch} from "react-hook-form";
import ErrorCode from "../../Pages/LoginPage/ErrorCode";


type Props = {
    form: UseFormReturn<any>,
    formFieldName: string
    startDateFieldName?: string,
    endDateFieldName?: string
}


export default function DateTimeFormPicker(props: Props) {
    return (
        <Controller
            name={props.formFieldName}
            control={props.form.control}
            rules={{
                validate: {
                    startBeforeEnd: (value: string) => {
                        if (props.startDateFieldName) { // value is the end date
                            if (new Date(value) <= new Date(props.form.getValues(props.startDateFieldName))) {
                                return "Data rozpoczęcia musi być wcześniejsza niż data zakończenia"
                            }
                        }
                        if (props.endDateFieldName) { // value is the start date
                            if (new Date(value) >= new Date(props.form.getValues(props.endDateFieldName))) {
                                return "Data rozpoczęcia musi być wcześniejsza niż data zakończenia"
                            }
                        }
                    }
                }
            }}
            render={({ field }) => (
                <>
                    <DatePicker
                        className={"d-flex w-100 text-center border border-opacity-75 rounded-2 p-1"}
                        closeOnScroll={true}
                        showYearDropdown
                        showTimeSelect
                        timeCaption="Godzina"
                        locale={"pl"}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(selectedOption) => {
                            props.form.setValue(
                                props.formFieldName,
                                selectedOption ? new Date(selectedOption).toISOString() : "",
                                { shouldDirty: true, shouldValidate: true, shouldTouch: true }
                            );
                        }}
                        dateFormat="dd/MM/yyyy HH:mm"
                    />
                    {props.form?.formState.errors[props.formFieldName] &&
                        <ErrorCode code={props.form?.formState.errors[props.formFieldName]?.message} />
                    }
                </>
            )}
        />
    )
}