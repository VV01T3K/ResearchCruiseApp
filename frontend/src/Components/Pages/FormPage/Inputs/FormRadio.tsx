import {
    Controller, FieldValues, useFormContext, UseFormReturn,
} from "react-hook-form";
import React, {useContext} from "react";
import FieldWrapper from "./FieldWrapper";
import {FormContext, FormValues} from "../Wrappers/FormTemplate";
import {readyFieldOptions} from "../Wrappers/ReactSelectWrapper";

export type FieldProps = {
    className?: string,
    fieldName: string,
    fieldLabel: string
}
type Props = FieldProps & {
    initValues?: string[],
}


function FormRadio(props: Props) {
    const formContext = useContext(FormContext)

    const render = ({field}:FieldValues) => (
        <div className="d-flex flex-column justify-content-center align-content-center">
            {props.initValues?.map((option, index) => (
                <input key={index} disabled={formContext!.readOnly}
                    className={`${field.value === index ? "radio-button-selected" : "radio-button-not-selected"}`}
                    type={"button"} value={option}
                    onClick={()=> formContext!.setValue(props.fieldName, index, readyFieldOptions)}
                />
            ))}
        </div>
    )

    const fieldProps = {
        ...props,
        rules: {required: 'Wybierz jedną z opcji'},
        render: render,
        defaultValue:[0,24]
    }

    return ( <FieldWrapper {...fieldProps}/> );
}


export default FormRadio