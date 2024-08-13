import React, {useContext, useEffect} from "react";
import FieldWrapper from "./FieldWrapper";
import {FormContext} from "../Wrappers/FormTemplate";
import {readyFieldOptions, SelectOptions, SelectSingleValue, SelectWrapper} from "../Wrappers/ReactSelectWrapper";
import {FieldValues, useFormContext} from "react-hook-form";
import Select from "react-select";

export type FormField = {
    className?: string,
    fieldName: string,
    fieldLabel: string,
}

type Props = FormField & {
    initValues?: number[]
}

function FormYearSelect(props: Props) {

    const formContext = useContext(FormContext)

    const setFirstAvailableYear = () => formContext!.setValue(
        props.fieldName,
        props.initValues![0],
        readyFieldOptions
    );

    useEffect(() => {
        if (props.initValues && !formContext!.getValues(props.fieldName))
            setFirstAvailableYear()
    },[]);


    const optionsMapper:SelectSingleValue[] | undefined= props.initValues?.map(value => ({value:value, label:value}))

    const render = ({field}:FieldValues) => {
        const currentValue = field.value ? { label: field.value, value: field.value}: null

        return(
            <SelectWrapper fieldName={props.fieldName} value={currentValue} options={optionsMapper}/>
        )
    }

    const fieldProps = {
        ...props,
        rules: {required: 'Wybierz jedną z opcji'},
        render: render
    }

    return ( <FieldWrapper {...fieldProps}/> )
}


export default FormYearSelect