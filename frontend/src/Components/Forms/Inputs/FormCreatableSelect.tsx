import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import {GroupBase, OptionsOrGroups} from "react-select";
import React from "react";
import CreatableSelect from "react-select/creatable";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    name: string,
    label: string,
    values: any[]
    form?: {
        control: Control | undefined;
        formState: {
            errors: {
                [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; };
            };
        };
    }
}


function FormCreatableSelect(props: Props) {
    return (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                control={props.form!.control}
                rules={{required: 'Wybierz jedną z opcji'}}
                render={({field}) => (
                    <CreatableSelect
                        isClearable
                        formatCreateLabel={(inputValue: any) => {
                            return `Dodaj: ${inputValue}`;
                        }}
                        minMenuHeight={300} {...field}
                        styles={{menu: (provided: any) => ({...provided, zIndex: 9999})}}
                        closeMenuOnScroll={() => true}
                        options={props.values?.map(value => ({label: value, value}))}
                    />
                )}
            />
        </InputWrapper>
    )
}


export default FormCreatableSelect