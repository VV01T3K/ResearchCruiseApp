import { FieldValues, useForm } from "react-hook-form"

export const useOnBlurForm = (defaultValues: FieldValues) =>
  useForm({
    mode: "onBlur",
    defaultValues: defaultValues,
    shouldUnregister: false,
    reValidateMode: "onBlur",
  })
