import {FieldValues, useFormContext} from "react-hook-form";
import React, {useContext, useEffect, useRef} from "react";
import FieldWrapper from "./FieldWrapper";
import {FormContext, FormValues} from "../Wrappers/FormTemplate";
import {readyFieldOptions} from "../Wrappers/ReactSelectWrapper";
import TextareaAutosize from 'react-textarea-autosize';

type Props = {
    className?: string,
    fieldLabel: string,
    fieldName: string,
    required?: any,
    maxLength?: number,
    resize?: string,
}

function TextArea(props: Props) {
    const formContext = useContext(FormContext)

    const onBlur = (e: { target: { value: string; }; }) => {
        var value = e.target.value
        if (props.maxLength && value.length > props.maxLength) {
            value = value.slice(0,props.maxLength)
        }
        formContext!.setValue(props.fieldName, value, readyFieldOptions)
    }

    const render = ({ field }:FieldValues) => (
            <TextareaAutosize
                className={"field-common h-100"}
                {...field}
                disabled={formContext!.readOnly ?? false}
                value={field.value?.toString()}
                onBlur={onBlur}
                placeholder={"Wpisz uwagi"}
            />)

    const fieldProps = {
        ...props,
        render: render,
        rules:{
        required: props.required ? "Pole wymagane":false,
            maxLength: {
            value: props.maxLength, // Maksymalna długość
                message: `Za długi tekst, maksymalna długość to ${props.maxLength ?? 200} znaków.`,
        },
        },
        defaultValue:""
    }

    return (
        <FieldWrapper {...fieldProps}/>
    )
}


export default TextArea