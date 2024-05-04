import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import Select from "react-select";
import React, {useEffect} from "react";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    name: string,
    label: string,
    values?: number[]
    form?: {
        setValue(name: string, selectedOption: any, arg2: { shouldDirty: boolean; shouldValidate: boolean; shouldTouch: boolean; }): unknown;
        control: Control<FieldValues, any> | undefined;
        formState: {
            errors: {
                [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; };
            };
        };
    }
}



function FormYearSelect(props: Props) {

    useEffect(() => {
        if(!props.form!.getValues(props.name) && props.values)
            props.form!.setValue(props.name, props.values[0], { shouldDirty: true, shouldValidate: true, shouldTouch:true });
    });

    return (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                control={props.form!.control}
                rules={{required: 'Wybierz jedną z opcji'}}
                render={({field}) => (
                    <Select minMenuHeight={300}

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
                                console.log(field.value)
                                props.form!.setValue(props.name, selectedOption.value, { shouldDirty: true, shouldValidate: true, shouldTouch:true });
                            }}
                    />
                )}
            />
        </InputWrapper>
    )
}


export default FormYearSelect