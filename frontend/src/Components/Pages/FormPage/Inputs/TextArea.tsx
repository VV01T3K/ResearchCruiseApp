import {FieldValues} from "react-hook-form";
import React, {useContext} from "react";
import FieldWrapper from "./FieldWrapper";
import {FormContext} from "../Wrappers/FormTemplate";
import TextareaAutosize from 'react-textarea-autosize';

type Props = {
    className?: string,
    fieldLabel: string,
    fieldName: string,
    required?: any,
    maxLength?: number,
    resize?: string,
    disabled?:boolean
}

function TextArea(props: Props) {
    const formContext = useContext(FormContext)

    // const onChange = (e: { target: { value: string; }; }) => {
    //     var value = e.target.value
    //     if (props.maxLength && value.length > props.maxLength) {
    //         value = value.slice(0,props.maxLength)
    //     }
    //
    //     // formContext!.setValue(props.fieldName, value, readyFieldOptions)
    // }

    const render = ({ field }:FieldValues) => (
            <TextareaAutosize
                className={"field-common h-100"}
                {...field}
                disabled={formContext!.readOnly ?? props.disabled}
                value={field.value?.toString()}
                // onBlur={onChange}
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
        defaultValue:"",

    }

    return (
        <FieldWrapper {...fieldProps}/>
    )
}


export default TextArea