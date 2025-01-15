import { FieldValues } from "react-hook-form"
import FieldWrapper from "./FieldWrapper"
import { SelectWrapper } from "../Wrappers/ReactSelectWrapper"
import { FormField } from "./FormYearSelect"
import { FormUser } from "FormUser"

type Props = FormField & {
  initValues?: FormUser[]
  required?: boolean
  defaultValue?: string
}

function UserSelect(props: Props) {
  function findLabel(field: FieldValues) {
    const item = props.initValues?.find((item) => item.id === field.value)
    if (item) {
      return item.firstName + " " + item.lastName + "\n(" + item.email + ")"
    }
    return ""
  }

  const optionsMapper = props.initValues?.map((value) => ({
    label: value.firstName + " " + value.lastName + "\n\r(" + value.email + ")",
    value: value.id,
  }))

  const render = ({ field }: FieldValues) => {
    const currentValue = field.value ? { label: findLabel(field), value: field.value } : null

    return (
      <SelectWrapper fieldName={props.fieldName} value={currentValue} options={optionsMapper} />
    )
  }

  const fieldProps = {
    ...props,
    rules: { required: props.required ?? "Wybierz jedną z opcji" },
    render: render,
    defaultValue: props.defaultValue ?? "",
  }

  return <FieldWrapper {...fieldProps} />
}

export default UserSelect
