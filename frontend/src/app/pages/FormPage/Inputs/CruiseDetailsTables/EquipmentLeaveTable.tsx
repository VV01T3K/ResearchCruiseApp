import { FieldProps } from "@app/pages/FormPage/Inputs/FormRadio"
import { useContext } from "react"
import {
  ActionPicker,
  NameField,
  TimeField,
} from "@app/pages/FormPage/Inputs/CruiseDetailsTables/EquipmentLeaveTableFields"
import {
  BottomMenuSingleSelect,
  OrdinalNumber,
  RemoveRowButton,
} from "@app/pages/FormPage/Inputs/TableParts"
import { FieldValues } from "react-hook-form"
import { FieldTableWrapper } from "@app/pages/FormPage/Wrappers/FieldTableWrapper"
import { FormContext } from "@contexts/FormContext"
import { FieldContext } from "@contexts/FieldContext"
import { notEmptyArray } from "@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable"
import FieldWrapper from "@app/pages/FormPage/Inputs/FieldWrapper"

export type EquipmentLeave = {
  action: string
  duration: string
  name: string
}

const equipmentLeaveDefault: EquipmentLeave[] = [
  {
    action: "Put",
    duration: "",
    name: "",
  },
  {
    action: "Collect",
    duration: "",
    name: "",
  },
]

export const equipmentLeaveActions = ["Put", "Collect"]

export const equipmentLeaveActionsPL = ["Pozostawienie", "Zabranie"]

export const equipmentLeaveOptions = equipmentLeaveActionsPL.map((taskLabel, index) => ({
  label: taskLabel,
  value: equipmentLeaveDefault[index],
}))

type EquipmentLeaveTableProps = FieldProps & {
  historicalEquipmentLeave?: EquipmentLeave[]
}

const EquipmentLeaveTableContent = () => [
  () => <OrdinalNumber label={"Sprzęt"} />,
  ActionPicker,
  TimeField,
  NameField,
  RemoveRowButton,
]

export const FieldContextWrapper =
  (Render: React.JSXElementConstructor<any>) =>
  ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
      <Render />
    </FieldContext.Provider>
  )

function EquipmentLeaveTable(props: EquipmentLeaveTableProps) {
  const formContext = useContext(FormContext)
  const mdColWidths = [5, 20, 30, 40, 5]
  const mdColTitles = [
    "Lp.",
    "Czynność",
    "Czas (pora dnia, przedział czasu itp.)",
    "Nazwa sprzętu",
    "",
  ]
  const colTitle = "Pozostawienie lub zabranie sprzętu"
  const bottomMenu = <BottomMenuSingleSelect options={equipmentLeaveOptions} />
  const emptyText = "Nie dodano żadnego sprzętu"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    EquipmentLeaveTableContent,
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
        notEmptyArray: notEmptyArray<EquipmentLeave>,
      },
    },
    render: FieldContextWrapper(Render),
  }

  return <FieldWrapper {...fieldProps} />
}

export default EquipmentLeaveTable
