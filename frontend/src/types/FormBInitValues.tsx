import {FormUser} from 'FormUser';
import {ResearchArea} from '@app/pages/FormPage/Inputs/ResearchAreaSelect';
import {ResearchTask} from '@app/pages/FormPage/Inputs/TaskTable/TaskTable';
import {Contract} from '@app/pages/FormPage/Inputs/ContractsTable/ContractsTable';
import {UgUnit} from '@app/pages/FormPage/Inputs/UgTeamsTable/UgTeamsTable';
import {SpubTask} from 'SpubTask';
import {CrewMember} from 'CrewMember';
import {ShortResearchEquipement} from 'ShortResearchEquipement';
import {ShipEquipment} from '@app/pages/FormPage/Forms/FormB/FormBSections/ShipEquipmentSection';

// TODO: Change
export type FormBInitValues = {
    cruiseManagers: FormUser[];
    deputyManagers: FormUser[];
    years: string[];
    shipUsages: string[];
    researchAreas: ResearchArea[];
    cruiseGoals: string[];
    historicalResearchTasks: ResearchTask[];
    historicalContracts: Contract[];
    ugUnits: UgUnit[];
    historicalGuestInstitutions: string[];
    historicalSpubTasks: SpubTask[];
    historicalEquipmentOutside: ShortResearchEquipement[];
    historicalCrew: CrewMember[];
    shipEquipments: ShipEquipment[]
};