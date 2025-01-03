import { FieldValues } from "react-hook-form"
import {
  CategoryPicker,
  InformationColumn,
  MinisterialPointsField,
  YearField,
} from "./PublicationsTableFields"
import { Publication } from "./PublicationsTable"
import {
  DisplayValueContext,
  DisplayWrapper,
  pointFieldRules,
  PointsField,
} from "@app/pages/FormPage/Inputs/TaskTable/EvaluatedTaskTable"
import { FieldProps } from "@app/pages/FormPage/Inputs/FormRadio"
import { FieldTableWrapper } from "@app/pages/FormPage/Wrappers/FieldTableWrapper"
import { OrdinalNumber } from "@app/pages/FormPage/Inputs/TableParts"
import { FieldContext } from "@contexts/FieldContext"
import FieldWrapper from "@app/pages/FormPage/Inputs/FieldWrapper"

type EvaluatedPublication = {
  id: string
  publication: Publication
  points: string
}

const PublicationTableContent = () => [
  () => <OrdinalNumber label={"Publikacja"} />,
  DisplayWrapper(CategoryPicker),
  DisplayWrapper(InformationColumn),
  DisplayWrapper(YearField),
  DisplayWrapper(MinisterialPointsField),
  PointsField,
]

type PublicationsTableProps = FieldProps & {
  evaluatedPublications?: EvaluatedPublication[]
}

export const PublicationsTable = (props: PublicationsTableProps) => {
  const mdColWidths = [5, 15, 46, 10, 14, 10]
  const mdColTitles = [
    "Lp.",
    "Kategoria",
    "Informacje",
    "Rok wydania",
    "Punkty ministerialne",
    "Punkty",
  ]
  const colTitle = "Publikacje"
  const emptyText = "Nie dodano żadnej publikacji"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    PublicationTableContent,
    null,
    emptyText,
    props.evaluatedPublications
  )

  const idAndPoints = props.evaluatedPublications?.map((value) => ({
    evaluationId: value.id,
    newPoints: value.points,
  }))
  const displayValue = props.evaluatedPublications?.map((value) => ({
    ...value.publication,
  }))

  const fieldProps = {
    ...props,
    defaultValue: idAndPoints,
    rules: pointFieldRules,
    render: ({ field }: FieldValues) => (
      <FieldContext.Provider value={field}>
        <DisplayValueContext.Provider value={displayValue}>
          <Render />
        </DisplayValueContext.Provider>
      </FieldContext.Provider>
    ),
  }

  return <FieldWrapper {...fieldProps} />
}

export default PublicationsTable
