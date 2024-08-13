import {FormUser} from "./Inputs/UserSelect";
import {ResearchArea} from "./Inputs/ClickableMap";
import {Task} from "./Inputs/TaskInput/TaskInput";
import {Contract} from "./Inputs/ContractsInput/ContractsInput";
import {UgTeam} from "./Inputs/UgTeamsInput/UgTeamsInput";
import {GuestsTeam} from "./Inputs/GuestTeamsInput/GuestTeamsInput";
import {Publication} from "./Inputs/PublicationsInput/PublicationsInput";
import {Thesis} from "./Inputs/ThesesInput/ThesesInput";
import {SpubTask} from "./Inputs/SpubTasksInput";

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