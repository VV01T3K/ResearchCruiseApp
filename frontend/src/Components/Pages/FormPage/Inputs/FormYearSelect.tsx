import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge, UseFormReturn} from "react-hook-form";
import Select from "react-select";
import React, {useEffect} from "react";
import InputWrapper from "./InputWrapper";
import {FormValues} from "../Wrappers/FormTemplate";


type Props = {
    className?: string,
    name: keyof FormValues,
    label: string,
    values?: number[]
    form?: UseFormReturn<FormValues>,
    readonly?:boolean
}



function FormYearSelect(props: Props) {

    useEffect(() => {
        if (!props.form!.getValues(props.name) && props.values) {
            props.form!.setValue(
                props.name,
                props.values[0],
                { shouldDirty: true, shouldValidate: true, shouldTouch: true }
            );
        }
    });

    return (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                control={props.form!.control}
                rules={{required: 'Wybierz jedną z opcji'}}
                render={({field}) => (
                    <Select minMenuHeight={300}
                            isDisabled={props.readonly ?? false}
                             value={{label:field.value, value:field.value}}
                            styles={{
                                control: (provided: any) => ({
                                    ...provided,
                                    cursor: "pointer",
                                    whiteSpace: "normal"

                                }),
                                menu: provided => ({
                                    ...provided,
                                    zIndex: 9999,
                                    whiteSpace: "normal"

                                }),
                            }}
                            options={props.values?.map(value => ({value:value, label:value}))}
                            onChange={(selectedOption) => {
                                props.form!.setValue(props.name, selectedOption?.value, { shouldDirty: true, shouldValidate: true, shouldTouch:true });
                            }}
                    />
                )}
            />
        </InputWrapper>
    )
}


export default FormYearSelect