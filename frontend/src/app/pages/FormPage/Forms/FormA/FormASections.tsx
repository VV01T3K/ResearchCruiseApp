import {CruiseManagerSection} from './FormASections/CruiseManagerSection';
import {TimeSection} from './FormASections/TimeSection';
import {PermissionsSection} from './FormASections/PermissionsSection';
import {ResearchAreaSection} from './FormASections/ResearchAreaSection';
import {GoalSection} from './FormASections/GoalSection';
import {TasksSection} from './FormASections/TasksSection';
import {ContractSection} from './FormASections/ContractSection';
import {ResearchTeamsSection} from './FormASections/ResearchTeamsSection';
import {PublicationsSection} from './FormASections/PublicationsSection';
import {SpubTasksSection} from './FormASections/SpubTasksSection';
import {SupervisorSection} from './FormASections/SupervisorSection';

export const FormASections = () => [
    CruiseManagerSection(),
    TimeSection(),
    PermissionsSection(),
    ResearchAreaSection(),
    GoalSection(),
    TasksSection(),
    ContractSection(),
    ResearchTeamsSection(),
    PublicationsSection(),
    SpubTasksSection(),
    SupervisorSection(),
];