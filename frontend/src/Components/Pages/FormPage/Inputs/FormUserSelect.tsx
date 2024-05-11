import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import Select from "react-select";
import React, {useEffect, useState} from "react";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    name: string,
    label: string,
    values?: [{lastName:string, firstName:string, email:string, id:string}]
    defaultValue?:string,
    form?: {
        setValue(name: string, selectedOption: any, arg2: { shouldDirty: boolean; shouldValidate: boolean; shouldTouch: boolean; }): unknown;
        control: Control<FieldValues, any> | undefined;
        formState: {
            errors: {
                [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; };
            };
        };
    }
    readonly? :boolean
}


function FormUserSelect(props: Props) {
    const [defaultValue, setDefaultValue] = useState("")

    useEffect(() => {
        if(!props.form!.getValues(props.name) && props.defaultValue) {
            props.form!.setValue(props.name, props.defaultValue[0].Id, {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true
            });
        }
    });

    function findLabel(field){
        const item = props.values?.find(item => item.Id === field.value )
        if(item)
            return item.FirstName + " " + item.LastName
        return ""
    }


    return (
        <InputWrapper {...props}>
            {/*{defaultValue}*/}
            <Controller
                name={props.name}
                control={props.form!.control}
                rules={{required: 'Wybierz jedną z opcji'}}

                render={({field}) => (
                    <Select minMenuHeight={300}
                         //   {/*{...field}*/}
                            isDisabled={props.readonly ?? false}
                            value={{label:findLabel(field), value:field.value}}
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
                            options={props.values?.map(value => ({label: value.FirstName + "\n\r" + value.LastName + "\n\r(" + value.Email + ")", value:value.Id}))}
                            onChange={(selectedOption) => {
                                props.form!.setValue(props.name, selectedOption.value, { shouldDirty: true, shouldValidate: true, shouldTouch:true });
                            }}
                    />
                )}
            />
        </InputWrapper>
    )
}


export default FormUserSelect