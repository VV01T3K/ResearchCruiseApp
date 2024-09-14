import React, {useContext} from "react";
import FormTemplate, {FormContext} from "../Wrappers/FormTemplate";
import {formType, FormTypeKeys, FormTypeValues} from "../../CommonComponents/FormTitleWithNavigation";
import {FormSectionType} from "../Wrappers/FormASections";

export const FormHelpers = () => {
    const formContext = useContext(FormContext)
    const ResetFieldValueIfExist = (fieldName:string) => {
        if(formContext?.getValues(fieldName))
            formContext?.resetField(fieldName)
    }
    const ClearFieldErrorIfExist = (fieldName:string) => {
        if(formContext?.formState?.errors[fieldName])
            formContext!.clearErrors(fieldName)

    }
    return {ResetFieldValueIfExist, ClearFieldErrorIfExist}
}
export const FormWrapper = (props:{sections:()=>FormSectionType[], type:FormTypeValues}) => {
    const sections = props.sections()
    return (
        <FormTemplate sections={sections} type={props.type}/>
    )
}