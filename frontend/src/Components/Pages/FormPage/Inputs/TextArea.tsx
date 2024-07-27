import {
    Control,
    Controller, UseFormReturn,
} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";
import {FormValues} from "../Wrappers/FormTemplate";


type Props = {
    className?: string,
    label: string,
    name: keyof FormValues,
    required?: any,
    maxLength?: number,
    resize?: string,
    form?: UseFormReturn<FormValues>,
    readonly?: boolean
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
                    <textarea className={"h-100"}
                              {...field}
                                disabled={props.readonly ?? false}
                              value={field.value?.toString() ?? ''}
                        // @ts-ignore
                              style={{resize: props.resize ?? "true"}}

                    />
                }
                name={props.name}
                control={props.form!.control}
                defaultValue={""}

                rules={{
                    required: props.required ?? "Pole wymagane",
                    maxLength: {
                        value: props.maxLength ?? 200, // Maksymalna długość
                        message: `Za długi tekst, maksymalna długość to ${props.maxLength ?? 200} znaków.`,
                    },
                }}
            />
        </InputWrapper>
    )
}


export default TextArea