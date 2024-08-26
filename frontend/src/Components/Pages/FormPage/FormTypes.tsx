import {FormUser} from "./Inputs/UserSelect";
import {ResearchArea} from "./Inputs/ClickableMap";
import {Task} from "./Inputs/TaskTable/TaskTable";
import {Contract} from "./Inputs/ContractsTable/ContractsTable";
import {UgTeam} from "./Inputs/UgTeamsTable/UgTeamsTable";
import {GuestsTeam} from "./Inputs/GuestTeamsTable/GuestTeamsTable";
import {Publication} from "./Inputs/PublicationsTable/PublicationsTable";
import {Thesis} from "./Inputs/ThesesTable/ThesesTable";
import {SpubTask} from "./Inputs/SpubTasksTable";

export type FormAInitValues = {
    cruiseManagers: FormUser[],
    deputyManagers: FormUser[],
    years: number[],
    shipUsages: string[],
    researchAreas: ResearchArea[],
    cruiseGoals: string[],
    historicalTasks: Task[]
}

export type FormAFields = {
    id?: string
    cruiseManagerId: string
    deputyManagerId: string
    year: number
    acceptablePeriod: number[]
    optimalPeriod: number[]
    cruiseHours: number
    cruiseDays?: number
    periodNotes?: string
    shipUsage: number
    differentUsage?: string
    permissionsRequired: number
    permissions?: string
    researchArea: number
    researchAreaInfo?: string
    cruiseGoal: number
    cruiseGoalDescription?: string
    researchTasks: Task[]
    contracts: Contract[]
    ugTeams: UgTeam[]
    guestTeams: GuestsTeam[]
    publications: Publication[]
    theses: Thesis[]
    spubTasks: SpubTask[]
}