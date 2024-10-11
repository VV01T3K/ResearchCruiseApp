import {
    CruiseApplicationDetailsSection,
} from './CruiseApplicationsDetailsSections/CruiseApplicationDetailsSection/CruiseApplicationDetailsSection';
import { TaskSection } from './CruiseApplicationsDetailsSections/TasksSection/TaskSection';
import { ContractSection } from './CruiseApplicationsDetailsSections/ContractSection/ContractSection';
import { ResearchTeamsSection } from './CruiseApplicationsDetailsSections/ResearchTeamsSection/ResearchTeamsSection';
import { PublicationsSection } from './CruiseApplicationsDetailsSections/PublicationsSection/PublicationsSection';
import { SpubTaskSection } from './CruiseApplicationsDetailsSections/SpubTaskSection/SpubTaskSection';

export const CruiseApplicationDetailsSections = () => {
    return [
        CruiseApplicationDetailsSection(),
        TaskSection(),
        ContractSection(),
        ResearchTeamsSection(),
        PublicationsSection(),
        SpubTaskSection(),
    ];
};