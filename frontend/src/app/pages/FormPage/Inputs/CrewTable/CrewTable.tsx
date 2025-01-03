import { FieldProps } from "@app/pages/FormPage/Inputs/FormRadio"
import { useContext } from "react"
import {
  IdentityColumn,
  InstitutionField,
  PersonalDataColumn,
} from "@app/pages/FormPage/Inputs/CrewTable/CrewTableFields"
import {
  BottomMenuWithAddButton,
  OrdinalNumber,
  RemoveRowButton,
} from "@app/pages/FormPage/Inputs/TableParts"
import { FieldValues } from "react-hook-form"
import { SingleValue } from "react-select"
import { FieldTableWrapper } from "@app/pages/FormPage/Wrappers/FieldTableWrapper"
import { FormContext } from "@contexts/FormContext"
import { FieldContext } from "@contexts/FieldContext"
import { notEmptyArray } from "@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable"
import FieldWrapper from "@app/pages/FormPage/Inputs/FieldWrapper"
import { CrewMember } from "CrewMember"
import { crewMemberDefault } from "@helpers/crewMemberDefault"

type CrewTableProps = FieldProps & { historicalCrew?: CrewMember[] }

const crewTableContent = () => {
  return [
    () => <OrdinalNumber label={"Członek załogi"} />,
    PersonalDataColumn,
    IdentityColumn,
    InstitutionField,
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

function CrewTable(props: CrewTableProps) {
  const formContext = useContext(FormContext)
  const mdColWidths = [5, 30, 35, 25, 5]
  const mdColTitles = [
    "Lp.",
    "Dane osobowe",
    "Dokument tożsamości",
    "Nazwa jednostki organizacyjnej UG lub instytucji zewnętrznej",
    "",
  ]
  const colTitle = "Lista uczestników rejsu"
  const bottomMenu = <BottomMenuWithAddButton newOption={crewMemberDefault as SingleValue<any>} />
  const emptyText = "Nie dodano żadnego członka załogi"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    crewTableContent,
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
        notEmptyArray: notEmptyArray<CrewMember>,
      },
    },
    render: FieldContextWrapper(Render),
  }

  return <FieldWrapper {...fieldProps} />
}

export default CrewTable
