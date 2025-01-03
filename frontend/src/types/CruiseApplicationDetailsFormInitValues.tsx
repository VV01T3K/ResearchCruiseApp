import { EvaluatedContract } from "EvaluatedContract"
import { EvaluatedPublication } from "@app/pages/FormPage/Inputs/PublicationsTable/EvaluatedPublicationsTable"
import { EvaluatedSpubTask } from "@app/pages/FormPage/Inputs/EvaluatedSpubTasksTable"
import { EvaluatedReseachTask } from "@app/pages/FormPage/Inputs/TaskTable/EvaluatedTaskTable"
import { UgTeam } from "@app/pages/FormPage/Inputs/UgTeamsTable/UgTeamsTable"

export type CruiseApplicationDetailsFormInitValues = {
  ugUnitsPoints: string
  formAContracts: EvaluatedContract[]
  formAPublications: EvaluatedPublication[]
  formASpubTasks: EvaluatedSpubTask[]
  formAResearchTasks: EvaluatedReseachTask[]
  ugTeams: UgTeam[]
  effectsPoints: string
}
