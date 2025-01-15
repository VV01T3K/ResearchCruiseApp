import { useContext } from "react"
import FormTemplate from "../Wrappers/FormTemplate"
import { FormContext } from "@contexts/FormContext"
import { FormSectionType } from "Form/Section/FormSectionType"
import {
  FormTypeKeys,
  FormTypeValues,
} from "../../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation"

export const FormHelpers = () => {
  const formContext = useContext(FormContext)
  const ResetFieldValueIfExist = (fieldName: string) => {
    if (formContext?.getValues(fieldName)) {
      formContext?.resetField(fieldName)
    }
  }
  const ClearFieldErrorIfExist = (fieldName: string) => {
    if (formContext?.formState?.errors[fieldName]) {
      formContext!.clearErrors(fieldName)
    }
  }
  return { ResetFieldValueIfExist, ClearFieldErrorIfExist }
}
export const FormWrapper = (props: { sections: () => FormSectionType[]; type: FormTypeValues }) => {
  const sections = props.sections()
  return <FormTemplate sections={sections} type={props.type as FormTypeKeys} />
}
