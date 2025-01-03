import { useContext } from "react"
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form"
import { FormContext } from "@contexts/FormContext"

type Props = {
  fieldName: string
  className?: string
}

export const ErrorMessage = (props: {
  display: boolean | undefined
  message?: string
  className?: string
}) => (
  <p className={`m-1 text-center text-danger ${props.className ?? ""}`}>
    {props.display ? "" : props.message}
  </p>
)

export default function ErrorMessageIfPresent(props: Props) {
  const formContext = useContext(FormContext)
  const fieldError: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined =
    formContext!.formState?.errors[props.fieldName]

  return (
    <ErrorMessage
      display={formContext!.readOnly}
      message={fieldError?.message as string}
      className={props.className}
    />
  )
}
