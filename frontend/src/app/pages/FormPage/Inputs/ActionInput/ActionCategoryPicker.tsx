import { ControllerRenderProps, FieldValues, UseFormReturn } from "react-hook-form"
import Select, { SingleValue } from "react-select"
import { Action } from "./ActionInput"

type Props = {
  name: string
  row: Action
  field: ControllerRenderProps<FieldValues, string>
  form: UseFormReturn
  readonly?: boolean
}

export default function ActionCategoryPicker(props: Props) {
  return (
    <Select
      isDisabled={props.readonly ?? false}
      minMenuHeight={300}
      className="d-flex col-12 justify-content-center form-control p-1"
      menuPlacement="auto"
      placeholder="Wybierz"
      styles={{
        control: (provided, _) => ({
          ...provided,
          boxShadow: "none",
          border: "1px solid grey",
          width: "100%",
          borderRadius: "2px",
          padding: "0px",
          fontSize: "0.8em",
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
          fontSize: "0.8em",
        }),
        singleValue: (provided) => ({
          ...provided,
          backgroundColor: "white",
        }),
        valueContainer: (provided) => ({
          ...provided,
          backgroundColor: "white",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          backgroundColor: "white",
        }),
      }}
      options={[
        { label: "Pozostawienie", value: "toLeave" },
        { label: "Zebranie", value: "toGrab" },
      ]}
      value={
        props.row.category && {
          label: props.row.category === "toLeave" ? "Pozostawienie" : "Zebranie",
          value: props.row.category,
        }
      }
      onChange={(selectedOption: SingleValue<"" | { label: string; value: string }>) => {
        if (selectedOption) {
          props.row.category = selectedOption.value
          props.form.setValue(props.name, props.field.value, {
            shouldTouch: true,
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      }}
    />
  )
}
