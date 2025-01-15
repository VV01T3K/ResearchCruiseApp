import ErrorMessageIfPresent from "../../../../components/Form/ErrorMessage/ErrorMessageIfPresent"
import React, { useContext } from "react"
import { Controller, FieldValues, RegisterOptions } from "react-hook-form"
import { FormContext } from "@contexts/FormContext"

type Props = {
  className?: string
  fieldLabel?: string
  fieldName: string
  rules: RegisterOptions
  render: (props: FieldValues) => React.ReactElement
  required?: string | boolean
  defaultValue?: FieldValues | string
}

export const FieldLabel = (props: { fieldLabel?: string }) => (
  <div className="mb-2">{props.fieldLabel}</div>
)

function FieldWrapper(props: Props) {
  const formContext = useContext(FormContext)
  const Field = () => (
    <Controller
      name={props.fieldName}
      control={formContext!.control}
      rules={props.rules}
      render={props.render}
      defaultValue={props.defaultValue}
    />
  )
  return (
    <div className={props.className + " field-wrapper"}>
      <FieldLabel fieldLabel={props.fieldLabel} />
      <Field />
      <ErrorMessageIfPresent fieldName={props.fieldName} />
    </div>
  )
}

export default FieldWrapper
