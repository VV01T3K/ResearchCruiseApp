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

function NumberInput(props: {
    className?: string,
    default:number,
    maxVal:number,
    label: string,
    name: string,
    handleInput: (arg0: number) => void,
    control: Control<FieldValues, any>,
    errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }}){

     const [value, setValue] = useState(props.default)

    useEffect(()=>{setValue(props.default)}, [props.default])
    const re =  /^[0-9\b]+$/;
    const onChange = (e) => {

        if (re.test(e.target.value)) {
            setValue(parseInt(e.target.value) > props.maxVal ? props.maxVal: parseInt(e.target.value))
        }
        else{
            setValue('')
        }
    }
    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            <Controller
                defaultValue={props.default}
                render={({ field }) => <input className={"text-center"} value={value}
                                              onBlur={
                    ()=>{
                        props.handleInput(value)
                        field.onBlur();

                    }
                } onChange={event=>{
                    onChange(event);
                    field.onChange(event);
                }} />}
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