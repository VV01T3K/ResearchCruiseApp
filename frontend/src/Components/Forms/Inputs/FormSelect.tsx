import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import Select from "react-select";
import React from "react";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    name: string,
    label: string,
    values: [{lastName:string, firstName:string, email:string, id:string}]
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
                         //   {/*{...field}*/}

                            value={props.values.find(item => item === field.value)}
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
                            options={props.values?.map(value => ({label: value.firstName + " " + value.lastName + " (" + value.email + ")", value:value.id}))}
                            onChange={(selectedOption) => {
                                props.form!.setValue(props.name, selectedOption.value, { shouldDirty: true, shouldValidate: true, shouldTouch:true });
                            }}
                    />
                )}
            />
        </InputWrapper>
    )
}


export default FormSelect