import { PermissionsSection } from "./FormCSections/PermissionsSection"
import { ResearchAreaSection } from "./FormCSections/ResearchAreaSection"
import { GoalSection } from "./FormCSections/GoalSection"
import { EffectsSection } from "./FormCSections/EffectsSection"
import { ContractSection } from "./FormCSections/ContractSection"
import { ResearchTeamsSection } from "./FormCSections/ResearchTeamsSection"
import { PublicationsSection } from "./FormCSections/PublicationsSection"
import { SpubTasksSection } from "./FormCSections/SpubTasksSection"
import { SupervisorSection } from "./FormCSections/SupervisorSection"
import { CruiseInfoSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/CruiseInfoSection"
import { CruiseManagersSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/CruiseManagersSection"
import { CruiseUsageSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/CruiseUsageSection"
import { CruiseDetailsSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/CruiseDetailsSection"
import { CruisePlanSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/CruisePlanSection"
import { EquipementSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/EquipmentSection"
import { ShipEquipmentSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/ShipEquipmentSection"
import { SamplesSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/SamplesSection"
import { SPUBDataSection } from "@app/pages/FormPage/Forms/FormC/FormCSections/SPUBDataSection"
import { SummarySection } from "@app/pages/FormPage/Forms/FormC/FormCSections/SummarySection"

export const FormCSections = () => [
  CruiseInfoSection(),
  CruiseManagersSection(),
  CruiseUsageSection(),
  PermissionsSection(),
  ResearchAreaSection(),
  GoalSection(),
  EffectsSection(),
  ContractSection(),
  ResearchTeamsSection(),
  PublicationsSection(),
  SpubTasksSection(),
  SupervisorSection(),
  CruiseDetailsSection(),
  CruisePlanSection(),
  EquipementSection(),
  ShipEquipmentSection(),
  SamplesSection(),
  SPUBDataSection(),
  SummarySection(),
]
