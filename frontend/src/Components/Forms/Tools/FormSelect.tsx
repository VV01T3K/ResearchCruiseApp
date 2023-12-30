import {Control, Controller, FieldError, FieldErrorsImpl, FieldValues, Merge} from "react-hook-form";
import Select, {GroupBase, OptionsOrGroups} from "react-select";
import ErrorCode from "../../LoginPage/ErrorCode";
import React from "react";

function FormSelect(props: {
    name:string,
    label:string,
    control: Control<FieldValues, any> | undefined,
    options: OptionsOrGroups<any, GroupBase<any>> | undefined, errors: any}){

    return  (<div className={"z-3"}>
            <label>{props.label}</label>
            <Controller
                name={props.name}
                control={props.control}
                defaultValue={null}
                rules={{required: 'Wybierz jedną z opcji'}} // Dodanie reguły walidacji
                render={({field}) => (
                    <>
                        <Select    minMenuHeight={300}
                            {...field}
                            options={props.options}
                        />
                        {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
                    </>
                )}
            />
        </div>
    )
}

export default FormSelect