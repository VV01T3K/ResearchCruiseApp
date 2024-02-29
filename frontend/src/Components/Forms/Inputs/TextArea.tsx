import {
    Control,
    Controller,} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";

function TextArea(props: {
    className?: string,
    label: string,
    name: string,
    required?:boolean,
    form: { setValue: (arg0: string, arg1: string) => void; control: Control<Record<string, any>, any> | undefined; } }){

    const onChange = (e: { target: { value: string; }; }) => {
        if (e.target.value.length<20) {
            props.form.setValue(props.name,e.target.value)
        }
        // else if(e.target.value=='')
        //     props.setValue(props.name, "0", {shouldValidate:true})
    }

    return (
        <InputWrapper {...props}>
            <Controller
                render={({ field  }) =>
                    <textarea   {...field} onChange={onChange} value={field.value ?? ''}  style={{maxHeight:"150px", minHeight:"50px"}}/>
            }
                name={props.name}
                control={props.form.control}

                rules={{required:props.required ??  false
            }}
            />
        </InputWrapper>
    )
}

export default TextArea