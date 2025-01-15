import { PermissionsSection } from "./FormBSections/PermissionsSection"
import { ResearchAreaSection } from "./FormBSections/ResearchAreaSection"
import { GoalSection } from "./FormBSections/GoalSection"
import { TasksSection } from "./FormBSections/TasksSection"
import { ContractSection } from "./FormBSections/ContractSection"
import { ResearchTeamsSection } from "./FormBSections/ResearchTeamsSection"
import { PublicationsSection } from "./FormBSections/PublicationsSection"
import { SpubTasksSection } from "./FormBSections/SpubTasksSection"
import { CruiseInfoSection } from "@app/pages/FormPage/Forms/FormB/FormBSections/CruiseInfoSection"
import { CruiseManagersSection } from "@app/pages/FormPage/Forms/FormB/FormBSections/CruiseManagersSection"
import { CruiseUsageSection } from "@app/pages/FormPage/Forms/FormB/FormBSections/CruiseUsageSection"
import { CruiseDetailsSection } from "@app/pages/FormPage/Forms/FormB/FormBSections/CruiseDetailsSection"
import { CruisePlanSection } from "@app/pages/FormPage/Forms/FormB/FormBSections/CruisePlanSection"
import { EquipementSection } from "@app/pages/FormPage/Forms/FormB/FormBSections/EquipmentSection"
import { ShipEquipmentSection } from "@app/pages/FormPage/Forms/FormB/FormBSections/ShipEquipmentSection"
import { SupervisorSection } from "@app/pages/FormPage/Forms/FormA/FormASections/SupervisorSection"

export const FormBSections = () => [
  CruiseInfoSection(),
  CruiseManagersSection(),
  CruiseUsageSection(),
  PermissionsSection(),
  ResearchAreaSection(),
  GoalSection(),
  TasksSection(),
  ContractSection(),
  ResearchTeamsSection(),
  PublicationsSection(),
  SpubTasksSection(),
  SupervisorSection(),
  CruiseDetailsSection(),
  CruisePlanSection(),
  EquipementSection(),
  ShipEquipmentSection(),
]
