import {useContext} from "react";
import {FormContext} from "../Wrappers/FormTemplate";

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