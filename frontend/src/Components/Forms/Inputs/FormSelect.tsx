import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import Select from "react-select";
import React from "react";
import InputWrapper from "./InputWrapper";

function FormSelect(props: {
    className?: string,
    name: string,
    label: string,
    values: any[]
    form?: { control: Control<FieldValues, any> | undefined; formState: { errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }; }; }}){

    return  (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                control={props.form!.control}
                rules={{required: 'Wybierz jedną z opcji'}}
                render={({field}) => (
                <Select minMenuHeight={300} {...field}
                        styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
                        options={props.values?.map(value => ({ label: value, value }))}
                        closeMenuOnScroll={() => true}
                        // onChange={(selectedOption) => {
                        //     // Przekazuje tylko wartość (value) do formularza
                        //     field.onChange(selectedOption ? selectedOption : null);
                        // }}
                />
                )}
            />
         </InputWrapper>
    )
}

export default FormSelect