import {
    Controller,
} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    label: string,
    name: string,
    values: string[], form?: any
}


function FormRadio(props: Props) {
    return (
        <InputWrapper {...props}>
            <Controller
                defaultValue={""}
                name={props.name}
                rules={{required: 'Wybierz jedną z opcji'}}
                control={props.form!.control}
                render={({field}) => (
                    <div className="d-flex flex-column justify-content-center align-content-center">
                        {props.values.map((option, index) => (
                            // <label key={index}>
                                <input key={index} className={`btn ${field.value === option ? "btn-primary":"btn-outline-primary"} text-wrap m-1`} style={{fontSize:"inherit"}}
                                    type={"button"}
                                    value={option}
                                    onClick={(e) => {
                                        props.form!.setValue(props.name, e.target.value, { shouldDirty: true, shouldValidate: true, shouldTouch:true });
                                    }}
                                    // onBlur={
                                    // props.form!.setValue(props.name, field.value, { shouldDirty: true, shouldValidate: true, shouldTouch:true })
                                    // }
                                    checked={field.value === option}
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