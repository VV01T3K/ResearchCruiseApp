import { FieldProps } from "@app/pages/FormPage/Inputs/FormRadio"
import { useContext } from "react"
import { FormContext } from "@contexts/FormContext"
import {
  BottomMenuWithAddButton,
  OrdinalNumber,
  RemoveRowButton,
} from "@app/pages/FormPage/Inputs/TableParts"
import {
  EntranceDateField,
  ExitDateField,
  NameField,
} from "@app/pages/FormPage/Inputs/CruiseDetailsTables/PortTableFields"
import { FieldValues } from "react-hook-form"
import { FieldContext } from "@contexts/FieldContext"
import { FieldTableWrapper } from "@app/pages/FormPage/Wrappers/FieldTableWrapper"
import { SingleValue } from "react-select"
import { notEmptyArray } from "@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable"
import FieldWrapper from "@app/pages/FormPage/Inputs/FieldWrapper"

export type Port = {
  startTime: string | undefined
  endTime: string | undefined
  name: string
}

const portDefault: Port = {
  startTime: "",
  endTime: "",
  name: "",
}

type PortTableProps = FieldProps & { historicalPorts?: Port[] }

const PortTableContent = () => {
  return [
    () => <OrdinalNumber label={""} />,
    EntranceDateField,
    ExitDateField,
    NameField,
    RemoveRowButton,
  ]
}

export const FieldContextWrapper =
  (Render: React.JSXElementConstructor<any>) =>
  ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
      <Render />
    </FieldContext.Provider>
  )

function PortTable(props: PortTableProps) {
  const formContext = useContext(FormContext)
  const mdColWidths = [5, 20, 20, 50, 5]
  const mdColTitles = ["Lp.", "Wejście", "Wyjście", "Nazwa portu", ""]
  const colTitle = "Wchodzenie/wychodzenie z portu"
  const bottomMenu = <BottomMenuWithAddButton newOption={portDefault as SingleValue<any>} />
  const emptyText = "Nie dodano żadnego sprzętu"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    PortTableContent,
    bottomMenu,
    emptyText,
    formContext!.getValues(props.fieldName)
  )

  const fieldProps = {
    ...props,
    defaultValue: [],
    rules: {
      required: false,
      validate: {
        notEmptyArray: notEmptyArray<Port>,
        rightDatePeriod: (value: Port[]) => {
          if (
            value.some((row: Port) => row.startTime && row.endTime && row.startTime >= row.endTime)
          ) {
            return "Data zakończenia przed datą rozpoczęcia"
          }
        },
      },
    },
    render: FieldContextWrapper(Render),
  }

  return <FieldWrapper {...fieldProps} />
}

export default PortTable
