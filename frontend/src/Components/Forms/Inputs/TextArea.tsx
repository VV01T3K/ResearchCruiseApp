import {
    Control,
    Controller,
    FieldError,
    FieldErrorsImpl,
    FieldValues,
    Merge,
} from "react-hook-form";
import React, {useEffect, useState} from "react";
import ErrorCode from "../../LoginPage/ErrorCode";

function TextArea(props: {
    className?: string,
    label: string,
    name: string,
    setValue: (arg0: string, arg1: string) => void,
    control: Control<FieldValues, any>,
    errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }}){

    const onChange = (e: { target: { value: string; }; }) => {
        if (e.target.value.length<20) {
            props.setValue(props.name,e.target.value)
        }
        // else if(e.target.value=='')
        //     props.setValue(props.name, "0", {shouldValidate:true})
    }

    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            <Controller
                render={({ field  }) => <textarea  onChange={onChange} value={field.value}  style={{maxHeight:"150px", minHeight:"50px"}}/>}
                name={props.name}
                control={props.control}
            />
            {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
        </div>
    )
}

export default TextArea