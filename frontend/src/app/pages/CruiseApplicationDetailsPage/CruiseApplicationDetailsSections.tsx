import {
    CruiseApplicationDetailsSection,
} from './CruiseApplicationsDetailsSections/CruiseApplicationDetailsSection/CruiseApplicationDetailsSection';
import {TaskSection} from './CruiseApplicationsDetailsSections/TasksSection/TaskSection';
import {ContractSection} from './CruiseApplicationsDetailsSections/ContractSection/ContractSection';
import {ResearchTeamsSection} from './CruiseApplicationsDetailsSections/ResearchTeamsSection/ResearchTeamsSection';
import {PublicationsSection} from './CruiseApplicationsDetailsSections/PublicationsSection/PublicationsSection';
import {SpubTaskSection} from './CruiseApplicationsDetailsSections/SpubTaskSection/SpubTaskSection';
import {
    EffectsPointsSection
} from "@app/pages/CruiseApplicationDetailsPage/CruiseApplicationsDetailsSections/EffectsPointsSection/EffectsPointsSection";

export const CruiseApplicationDetailsSections = () => {
    return [
        CruiseApplicationDetailsSection(),
        TaskSection(),
        EffectsPointsSection(),
        ContractSection(),
        ResearchTeamsSection(),
        PublicationsSection(),
        SpubTaskSection(),
    ];
};