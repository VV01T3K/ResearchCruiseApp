import { ResearchTask } from "@app/pages/FormPage/Inputs/TaskTable/TaskTable"
import { Contract } from "@app/pages/FormPage/Inputs/ContractsTable/ContractsTable"
import { UgTeam } from "@app/pages/FormPage/Inputs/UgTeamsTable/UgTeamsTable"
import { GuestsTeam } from "@app/pages/FormPage/Inputs/GuestTeamsTable/GuestTeamsTable"
import { Publication } from "@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable"
import { Thesis } from "@app/pages/FormPage/Inputs/ThesesTable/ThesesTable"
import { SpubTask } from "SpubTask"

export type FormAFields = {
  id?: string
  cruiseManagerId?: string
  deputyManagerId?: string
  year: string
  acceptablePeriod: string[]
  optimalPeriod: string[]
  cruiseHours: string
  periodNotes?: string
  shipUsage: string
  differentUsage?: string
  permissionsRequired: string
  permissions?: string // TODO: Change - it's no longer a string
  researchAreaId: string
  researchAreaInfo?: string
  cruiseGoal: string
  cruiseGoalDescription?: string
  researchTasks: ResearchTask[]
  contracts: Contract[]
  ugTeams: UgTeam[]
  guestTeams: GuestsTeam[]
  publications: Publication[]
  theses: Thesis[]
  spubTasks: SpubTask[]
}
