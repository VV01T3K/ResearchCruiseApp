import {
    Control,
    Controller,} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";

function TextArea(props: {
    className?: string,
    label: string,
    name: string,
    required?: any,
    maxLenth?:number,
    form?: { setValue: (arg0: string, arg1: string) => void; control: Control<Record<string, any>, any> | undefined; } }){

    const onChange = (e: { target: { value: string; }; }) => {
        if (e.target.value.length<20) {
            props.form!.setValue(props.name,e.target.value)
        }
        // else if(e.target.value=='')
        //     props.setValue(props.name, "0", {shouldValidate:true})
    }

    return (
        <InputWrapper {...props}>
            <Controller
                render={({ field  }) =>
                    <textarea   {...field} value={field.value ?? ''}  style={{maxHeight:"130px", minHeight:"70px"}}/>
            }
                name={props.name}
                control={props.form!.control}

                rules={{required:props.required ??  true,
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