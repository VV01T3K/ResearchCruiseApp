import { createContext, useContext } from "react"
import { FieldValues } from "react-hook-form"
import {
  BottomMenuSingleSelect,
  CellFormTools,
  CellTools,
  OrdinalNumber,
  RemoveRowButton,
} from "../TableParts"
import FieldWrapper from "../FieldWrapper"
import { FormField } from "../FormYearSelect"
import { FIntField } from "../CellFormFields"
import { DisplayContext } from "../TaskTable/EvaluatedTaskTable"
import { FormContext } from "@contexts/FormContext"
import { FieldContext } from "@contexts/FieldContext"
import { KeyContext } from "@contexts/KeyContext"
import { FieldTableWrapper } from "../../Wrappers/FieldTableWrapper"

export type UgTeam = {
  ugUnitId: string
  noOfEmployees: string
  noOfStudents: string
}

export type UgUnit = {
  name: string
  id: string
}

type Props = FormField & {
  initValues?: UgUnit[]
}

export const NoOfStudentsField = () => (
  <KeyContext.Provider value={"noOfStudents"}>
    <div className={"task-field-input"}>
      <label className={"table-field-input-label"}>Liczba studentów</label>
      <FIntField />
    </div>
  </KeyContext.Provider>
)

export const NoOfEmployeesField = () => (
  <KeyContext.Provider value={"noOfEmployees"}>
    <div className={"task-field-input"}>
      <label className={"table-field-input-label"}>Liczba pracowników</label>
      <FIntField />
    </div>
  </KeyContext.Provider>
)

const ugTeamsTableContent = () => [
  () => <OrdinalNumber label={"Jednostka"} />,
  UnitField,
  NoOfEmployeesField,
  NoOfStudentsField,
  RemoveRowButton,
]

export const UnitField = () => {
  return (
    <KeyContext.Provider value={"ugUnitId"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Jednostka:</label>
        <FStringValueField />
      </div>
    </KeyContext.Provider>
  )
}

export const UnitNameField = () => {
  return (
    <KeyContext.Provider value={"ugUnitName"}>
      <div className={"task-field-input"}>
        <label className={"table-field-input-label"}>Jednostka</label>
        <FStringValueField />
      </div>
    </KeyContext.Provider>
  )
}

export const FStringValueField = () => {
  const initContext = useContext(InitContext)
  const displayContext = useContext(DisplayContext)
  const { cellValue } = displayContext ? CellTools() : CellFormTools()

  return (
    <div className={"text-break"}>
      {!displayContext &&
        initContext &&
        initContext.find((unit: UgUnit) => unit.id == cellValue)?.name}
      {displayContext && cellValue}
    </div>
  )
}

export const button = () => {
  const { cellValue } = CellTools()
  return <>{cellValue}</>
}

export const InitContext = createContext<any>(null)

function UgTeamsTable(props: Props) {
  const formContext = useContext(FormContext)
  const unitIds = formContext?.getValues(props.fieldName)?.map((row: UgTeam) => row.ugUnitId)
  const filteredInitValues =
    unitIds && props.initValues?.filter((unit) => !unitIds?.includes(unit.id))
  const selectOptions =
    filteredInitValues?.map((ugUnit: UgUnit) => ({
      label: ugUnit.name,
      value: {
        ugUnitId: ugUnit.id,
        noOfEmployees: "0",
        noOfStudents: "0",
      },
    })) ?? []

  const mdColWidths = [10, 32, 24, 24, 10]
  const mdColTitles = ["Lp.", "Jednostka", "Liczba pracowników", "Liczba studentów", ""]
  const colTitle = "Jednostki"
  const bottomMenu = <BottomMenuSingleSelect options={selectOptions} />
  const emptyText = "Nie dodano żadnej jednostki"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    ugTeamsTableContent,
    bottomMenu,
    emptyText,
    formContext!.getValues(props.fieldName)
  )

  const fieldProps = {
    ...props,
    defaultValue: [],
    rules: {
      required: "Pole wymagane",
      validate: {
        notEmptyArray: (value: FieldValues) => {
          if (
            value.some((row: UgTeam) => {
              return parseInt(row.noOfEmployees) <= 0 && parseInt(row.noOfStudents) <= 0
            })
          ) {
            return "Dodaj przynajmniej jedną osobę z jednostki"
          }
        },
      },
    },
    render: ({ field }: FieldValues) => (
      <FieldContext.Provider value={field}>
        <InitContext.Provider value={props.initValues}>
          <Render />
        </InitContext.Provider>
      </FieldContext.Provider>
    ),
  }

  return <FieldWrapper {...fieldProps} />
}

export default UgTeamsTable
