import {
    Control,
    Controller,
    FieldError,
    FieldErrorsImpl,
    FieldValues,
    Merge,
} from "react-hook-form";
import React from "react";
import ErrorCode from "../../LoginPage/ErrorCode";

function IntInput(props: {
    className?: string,
    label: string,
    name: string,
    setValue,
    maxVal,
    control: Control<FieldValues, any>,
    errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }}){


    const re =  /^[0-9\b]+$/;
    const onChange = (e: { target: { value: string; }; }) => {
        if (re.test(e.target.value)) {
            props.setValue(props.name, String(parseInt(e.target.value) > props.maxVal ? props.maxVal: parseInt(e.target.value)), {shouldDirty:true})

            props.setValue(props.name, String(parseInt(e.target.value) > props.maxVal ? props.maxVal: parseInt(e.target.value)), { shouldValidate:true})
        }
        else
            props.setValue(props.name, "0", {shouldValidate:true})
    }
    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            <Controller
                render={({ field }) => <input className={"text-center"} value={field.value}
                                              onBlur={field.onBlur}
                                              onChange={(e)=>{onChange(e)}} />}

                rules={{ required:"Pole nie może być puste" }}
                name={props.name}
                control={props.control}
            />
            {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
        </div>
    )
}

export default IntInput