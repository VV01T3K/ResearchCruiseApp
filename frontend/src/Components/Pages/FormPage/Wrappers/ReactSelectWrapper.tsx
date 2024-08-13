import React, {CSSProperties, useContext, useState} from "react";
import {FormContext} from "./FormTemplate";
import Select, {CSSObjectWithLabel, GroupBase, OptionsOrGroups, SingleValue} from "react-select";
import {useFormContext} from "react-hook-form";

export const readyFieldOptions = { shouldDirty: true, shouldValidate: true, shouldTouch: true }

export type SelectSingleValue = SingleValue<{ label: string, value: string }>
export type SelectOptions = OptionsOrGroups<SelectSingleValue, GroupBase<SelectSingleValue>> | undefined

export const SelectWrapper = (props:{fieldName:string, value:SelectSingleValue, options:SelectOptions}) => {
    const [inputValue, setInputValue] = useState("")

    const commonSelectProps = {
        menuPortalTarget:document.body,
        // workaround for invalid caret position
        styles:{input: (provided:CSSObjectWithLabel) => ({...provided, caretColor: inputValue ? "black": "transparent" })}
    }

    const formContext = useContext(FormContext)
    const setSelectedValue = (selectedOption: SelectSingleValue) => {
        formContext!.setValue( props.fieldName, selectedOption?.value, readyFieldOptions);
    }
    return(
        <Select {...commonSelectProps} placeholder={"Wyszukaj"}  noOptionsMessage={() => "Brak wyników"}
                inputValue={inputValue} onInputChange={(e) => setInputValue(e)}
                {...props} className={"select"} classNamePrefix={"select"}
                isDisabled={formContext?.readOnly ?? false} onChange={setSelectedValue}
        />
    )
}
