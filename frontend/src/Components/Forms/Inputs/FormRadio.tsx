import {
    Controller,
} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";

function FormRadio(props: {
    className?: string,
    label: string,
    name: string,
    values: string[], form?: any}){

    return (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                control={props.form!.control}
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
        </InputWrapper>
    )
}

export default FormRadio