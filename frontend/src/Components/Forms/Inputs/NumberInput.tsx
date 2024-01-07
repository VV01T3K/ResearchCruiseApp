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

function NumberInput(props: {
    className?: string,
    label: string,
    name: string,
    maxVal: number,
    setValue: (arg0: string, arg1: string, arg2: { shouldValidate: boolean; } | undefined) => void,
    newVal: (arg0: number) => any,
    name2: string,
    control: Control<FieldValues, any>,
    errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }}){


    const re =  /^[0-9\b]+$/;
    const onChange = (e: { target: { value: string; }; }) => {
        if (re.test(e.target.value)) {
            props.setValue(props.name, String(parseInt(e.target.value) > props.maxVal ? props.maxVal: parseInt(e.target.value)), {shouldDirty:true})

            props.setValue(props.name, String(parseInt(e.target.value) > props.maxVal ? props.maxVal: parseInt(e.target.value)), { shouldValidate:true})
        }
        else //if(e.target.value=='')
            props.setValue(props.name, "0", {shouldValidate:true})
    }
    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            <Controller
                render={({ field }) => <input className={"text-center"} value={field.value}
                                              onBlur={(e)=>{
                                                  props.setValue(props.name2, String(props.newVal(parseInt(e.target.value))), { shouldDirty: true })
                                                  props.setValue(props.name2, String(props.newVal(parseInt(e.target.value))), { shouldValidate: true })
                                                  props.setValue(props.name, String(parseInt(e.target.value)), { shouldDirty: true })
                                                  props.setValue(props.name, String(parseInt(e.target.value)), { shouldValidate: true })
                        // field.onBlur();
                    }
                } onChange={(e)=>{onChange(e)}} />}
                name={props.name}
                control={props.control}
                rules={{
                    required:"Pole nie może być puste" ,
                    validate: (value) => Number(value) != 0 ||   'Pole nie może mieć wartości 0.'
                }
                }
            />
            {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
        </div>
    )
}

export default NumberInput