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
    control: Control<FieldValues, any>,
    errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }}){
    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            <Controller
                render={({ field  }) => <textarea   onBlur={field.onBlur} onChange={field.onChange}  />}
                name={props.name}
                control={props.control}
                rules={{
                    required:"Pole nie może być puste" ,
                    validate: (value) => value>=1 ||   'Pole nie może mieć wartości 0.'
                }
                }
            />
            {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
        </div>
    )
}

export default TextArea