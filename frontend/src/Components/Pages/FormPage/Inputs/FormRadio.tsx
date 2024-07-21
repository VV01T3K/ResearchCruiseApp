import {
    Controller, UseFormReturn,
} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";
import {FormValues} from "../Wrappers/FormTemplate";


type Props = {
    className?: string,
    label: string,
    name: keyof FormValues,
    values?: string[],
    form?: UseFormReturn<FormValues>,
    readonly? :boolean
}


function FormRadio(props: Props) {
    return (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                rules={{required: 'Wybierz jedną z opcji'}}
                control={props.form!.control}
                render={({field}) => (
                    <div className="d-flex flex-column justify-content-center align-content-center">
                        {props.values?.map((option, index) => (
                            // <label key={index}>
                            <input
                                key={index}
                                disabled={props.readonly ?? false}
                                className={`btn ${field.value === index ? "btn-info" : "btn-outline-info"} ${(field.value !== index) && (props.readonly ?? false) ? "d-none": "" } text-wrap m-1`}
                                style={{fontSize:"inherit"}}
                                type={"button"}
                                value={option}
                                onClick={(e) => {
                                    props.form!.setValue(props.name, index, { shouldDirty: true, shouldValidate: true, shouldTouch:true });
                                }}
                                // onBlur={
                                // props.form!.setValue(props.name, field.value, { shouldDirty: true, shouldValidate: true, shouldTouch:true })
                                // }
                                // checked={field.value === option}
                            />
                            // {/*{option}*/}
                            // </label>
                        ))}
                    </div>
                )}
            />
        </InputWrapper>
    )
}


export default FormRadio