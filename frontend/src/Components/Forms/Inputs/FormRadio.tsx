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
    options,
    errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }}){

    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            {props.options.map((value, index)=>
                (<Controller
                key={index}
                render={({ field }) => (
                    <div className={"d-flex flex-column"}>
                           <label>
                                <input
                                    type="radio"
                                    value={value}
                                    {...field}
                                    checked={field.value === value}
                                />
                               {value}
                            </label>
                    </div>)}
                        name={props.name}
                control={props.control}
                rules={{
                    required:"Pole nie może być puste" ,
                }
                }
            />))}
            {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
        </div>
    )
}

export default FormRadio