import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import Select from "react-select";
import React from "react";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    name: string,
    label: string,
    values: any[]
    form?: {
        control: Control<FieldValues, any> | undefined;
        formState: {
            errors: {
                [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; };
            };
        };
    }
}


function FormSelect(props: Props) {
    return (
        <InputWrapper {...props}>
            <Controller
                defaultValue={""}
                name={props.name}
                control={props.form!.control}
                rules={{required: 'Wybierz jedną z opcji'}}
                render={({field}) => (
                    <Select minMenuHeight={300}
                            {...field}
                            styles={{menu: provided => ({...provided, zIndex: 9999})}}
                            options={props.values?.map(value => ({label: value, value}))}
                            onChange={(selectedOption) => {
                                props.form!.setValue(props.name, selectedOption, { shouldDirty: true, shouldValidate: true, shouldTouch:true });
                            }}
                    />
                )}
            />
        </InputWrapper>
    )
}


export default FormSelect