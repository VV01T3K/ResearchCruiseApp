import { FieldValues } from "react-hook-form"
import { useContext } from "react"
import FieldWrapper from "./FieldWrapper"
import { FieldProps } from "@app/pages/FormPage/Inputs/FormRadio"
import CustomConverter from "../../../../ToBeMoved/Tools/CustomConverter"
import { ReadOnlyContext } from "@contexts/ReadOnlyContext"

type Props = FieldProps & {
  defaultValue?: string
}

function BoolField(props: Props) {
  const render = ({ field }: FieldValues) => {
    const isTrue = CustomConverter.stringToBoolean(field.value)
    const readOnlyContext = useContext(ReadOnlyContext)
    return (
      <div className={"d-flex flex-row w-100"}>
        <button
          disabled={readOnlyContext}
          onClick={() => field.onChange("true")}
          className={" field-common col-6 m-1 " + (isTrue ? " bg-primary text-white" : "")}
        >
          Tak
        </button>
        <button
          disabled={readOnlyContext}
          onClick={() => field.onChange("false")}
          className={"field-common col-6 m-1" + (!isTrue ? " bg-primary text-white" : "")}
        >
          Nie
        </button>
      </div>
    )
  }

  const fieldProps = {
    ...props,
    defaultValue: props.defaultValue ?? "false",
    rules: { required: "Wybierz jedną z opcji" },
    render: render,
  }

  return <FieldWrapper {...fieldProps} />
}

export default BoolField
