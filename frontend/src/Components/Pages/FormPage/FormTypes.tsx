import {FormUser} from "./Inputs/UserSelect";
import {ResearchArea} from "./Inputs/ClickableMap";
import {Task} from "./Inputs/TaskTable/TaskTable";
import {Contract} from "./Inputs/ContractsTable/ContractsTable";
import {UgTeam, UgUnit} from "./Inputs/UgTeamsTable/UgTeamsTable";
import {GuestsTeam} from "./Inputs/GuestTeamsTable/GuestTeamsTable";
import {Publication} from "./Inputs/PublicationsTable/PublicationsTable";
import {Thesis} from "./Inputs/ThesesTable/ThesesTable";
import {SpubTask} from "./Inputs/SpubTasksTable";

export type FormAInitValues = {
    cruiseManagers: FormUser[],
    deputyManagers: FormUser[],
    years: string[],
    shipUsages: string[],
    researchAreas: ResearchArea[],
    cruiseGoals: string[],
    historicalTasks: Task[]
    ugUnits:UgUnit[]
}

export type FormAFields = {
    id?: string
    cruiseManagerId: string
    deputyManagerId: string
    year: string
    acceptablePeriod: string[]
    optimalPeriod: string[]
    cruiseHours: string
    periodNotes?: string
    shipUsage: string
    differentUsage?: string
    permissionsRequired: string
    permissions?: string
    researchArea: string
    researchAreaInfo?: string
    cruiseGoal: string
    cruiseGoalDescription?: string
    researchTasks: Task[]
    contracts: Contract[]
    ugTeams: UgTeam[]
    guestTeams: GuestsTeam[]
    publications: Publication[]
    theses: Thesis[]
    spubTasks: SpubTask[]
}