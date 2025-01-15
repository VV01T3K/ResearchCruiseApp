import { useContext } from "react"
import { FormContext } from "@contexts/FormContext"
import { EvaluatedTasksTable } from "../../../FormPage/Inputs/TaskTable/EvaluatedTaskTable"
import { researchTasksSectionFieldNames } from "./ResearchTasksSectionFieldNames"
import { CruiseApplicationDetailsFormInitValues } from "CruiseApplicationDetailsFormInitValues"

export const TasksField = () => {
  const formContext = useContext(FormContext)
  return (
    <EvaluatedTasksTable
      className="single-field"
      fieldLabel=""
      fieldName={researchTasksSectionFieldNames.researchTasks}
      evaluatedReseachTasks={
        (formContext!.initValues as CruiseApplicationDetailsFormInitValues)?.formAResearchTasks
      }
    />
  )
}
