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

function FormRadio(props: {
    className?: string,
    label: string,
    name: string,
    control: Control<FieldValues, any>,
    values: string[],
    errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }}){

    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            <Controller
                name={props.name}
                control={props.control}
                render={({ field }) => (
                    <div className={"d-flex flex-column"}>
                        {props.values.map((option, index)=> (
                           <label key={index}>
                                <input
                                    type="radio"
                                    value={option}
                                    onChange={field.onChange}
                                    checked={field.value === option}
                                />
                               {option}
                            </label>))
                        }
                    </div>)}
            />
            {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
        </div>
    )
}

export default FormRadio