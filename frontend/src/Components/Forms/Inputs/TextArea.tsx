import {
    Control,
    Controller,
} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    label: string,
    name: string,
    required?: any,
    maxLenth?: number,
    resize,
    form?: {
        setValue: (arg0: string, arg1: string) => void;
        control: Control<Record<string, any>, any> | undefined;
    }
}


function TextArea(props: Props) {
    const onChange = (e: { target: { value: string; }; }) => {
        if (e.target.value.length < 20) {
            props.form!.setValue(props.name, e.target.value)
        }
        // else if(e.target.value=='')
        //     props.setValue(props.name, "0", {shouldValidate:true})
    }

    return (
        <InputWrapper {...props}>
            <Controller
                render={({ field}) =>
                    <textarea className={"h-100"} {...field}
                              value={field.value ?? ''}
                              style={{resize:props.resize ?? "true"}}

                    />
                }
                name={props.name}
                control={props.form!.control}
                defaultValue={""}

                rules={{
                    required: props.required ?? "Pole wymagane",
                    maxLength: {
                        value: props.maxLenth ?? 200, // Maksymalna długość
                        message: `Za długi tekst, maksymalna długość to ${props.maxLenth ?? 200} znaków.`,
                    },
                }}
            />
        </InputWrapper>
    )
}


export default TextArea