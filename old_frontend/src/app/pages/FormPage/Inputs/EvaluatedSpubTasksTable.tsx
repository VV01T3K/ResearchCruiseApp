import { FieldValues } from "react-hook-form"
import { OrdinalNumber } from "./TableParts"
import { FieldProps } from "./FormRadio"
import FieldWrapper from "./FieldWrapper"
import {
  DisplayValueContext,
  DisplayWrapper,
  pointFieldRules,
  PointsField,
} from "./TaskTable/EvaluatedTaskTable"
import { EndYearField, NameField, StartYearField } from "./SpubTasksTable"
import { SpubTask } from "SpubTask"
import { FieldTableWrapper } from "../Wrappers/FieldTableWrapper"
import { FieldContext } from "@contexts/FieldContext"

export type EvaluatedSpubTask = {
  id: string
  spubTask: SpubTask
  points: string
}

const ThesesTableContent = () => [
  () => <OrdinalNumber label={"Zadanie"} />,
  DisplayWrapper(StartYearField),
  DisplayWrapper(EndYearField),
  DisplayWrapper(NameField),
  PointsField,
]

type EvaluatedSpubTasksTable = FieldProps & {
  evaluatedSpubTasks: EvaluatedSpubTask[]
}

export const EvaluatedSpubTaskTable = (props: EvaluatedSpubTasksTable) => {
  const mdColWidths = [5, 15, 15, 55, 10]
  const mdColTitles = ["Lp.", "Rok rozpoczęcia", "Rok zakończenia", "Nazwa zadania", "Punkty"]
  const colTitle = "Zadania"
  const emptyText = "Nie dodano żadnego zadania"
  const { Render } = FieldTableWrapper(
    colTitle,
    mdColWidths,
    mdColTitles,
    ThesesTableContent,
    null,
    emptyText,
    props.evaluatedSpubTasks
  )

  const idAndPoints = props.evaluatedSpubTasks?.map((value) => ({
    evaluationId: value.id,
    newPoints: value.points,
  }))
  const displayValue = props.evaluatedSpubTasks?.map((value) => ({
    ...value.spubTask,
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
