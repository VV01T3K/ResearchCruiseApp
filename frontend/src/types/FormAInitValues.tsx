import {FormUser} from 'FormUser';
import {ResearchArea} from '@app/pages/FormPage/Inputs/ResearchAreaSelect';
import {ResearchTask} from '@app/pages/FormPage/Inputs/TaskTable/TaskTable';
import {Contract} from '@app/pages/FormPage/Inputs/ContractsTable/ContractsTable';
import {UgUnit} from '@app/pages/FormPage/Inputs/UgTeamsTable/UgTeamsTable';
import {SpubTask} from 'SpubTask';
import {GuestsTeam} from '@app/pages/FormPage/Inputs/GuestTeamsTable/GuestTeamsTable';
import {Publication} from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';

export type FormAInitValues = {
    cruiseManagers: FormUser[];
    deputyManagers: FormUser[];
    years: string[];
    shipUsages: string[];
    researchAreas: ResearchArea[];
    cruiseGoals: string[];
    historicalResearchTasks: ResearchTask[];
    guestTeams: GuestsTeam[],
    historicalContracts: Contract[];
    historicalPublications: Publication[];
    ugUnits: UgUnit[];
    historicalGuestInstitutions: string[];
    historicalSpubTasks: SpubTask[];
};