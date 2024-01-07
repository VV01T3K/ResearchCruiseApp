import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import Select, {GroupBase, OptionsOrGroups} from "react-select";
import ErrorCode from "../../LoginPage/ErrorCode";
import React from "react";

function FormSelect(props: {
    className?:string,
    name:string,
    label:string,
    control: Control<FieldValues, any> | undefined,
    options: OptionsOrGroups<any, GroupBase<any>> | undefined, errors: any}){

    return  (
        <div className={props.className + " p-3"}>
            <label>{props.label}</label>
            <Controller
                name={props.name}
                control={props.control}
                rules={{required: 'Wybierz jedną z opcji'}}
                render={({field}) => (
                <Select minMenuHeight={300} {...field}
                        styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
                        options={props.options}
                        closeMenuOnScroll={() => true}
                />
                )}
            />
            {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
        </div>
    )
}

export default FormSelect