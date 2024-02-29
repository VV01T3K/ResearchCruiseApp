import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import {GroupBase, OptionsOrGroups} from "react-select";
import React from "react";
import CreatableSelect from "react-select/creatable";
import InputWrapper from "./InputWrapper";

function FormCreatableSelect(props: {
    className?: string,
    name: string,
    label: string,
    options: OptionsOrGroups<any, GroupBase<any>> | undefined,
    form: { control: Control | undefined; formState: { errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }; }; }}){

    return  (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                control={props.form.control}
                rules={{required: 'Wybierz jedną z opcji'}}
                render={({field}) => (
                <CreatableSelect
                    isClearable
                    formatCreateLabel={(inputValue: any) => {
                        return `Dodaj: ${inputValue}`;
                    }}
                    minMenuHeight={300} {...field}
                        styles={{menu: (provided: any) => ({ ...provided, zIndex: 9999 })}}
                        options={props.options}
                        closeMenuOnScroll={() => true}

                />
                )}
            />
        </InputWrapper>
    )
}

export default FormCreatableSelect