import { CrewMemberValues } from './CrewMemberValues';
import { CruiseDayValues } from './CruiseDayValues';
import { GuestTeamValues } from './GuestTeamValues';
import { LongResearchEquipmentValues } from './LongResearchEquipmentValues';
import { PermissionValues } from './PermissionValues';
import { PortCallValues } from './PortCallValues';
import { ResearchEquipmentValues } from './ResearchEquipmentValues';
import { ShortResearchEquipmentValues } from './ShortResearchEquipmentValues';
import { UgTeamValues } from './UgTeamValues';

export type FormBValues = {
  isCruiseManagerPresent: 'true' | 'false';
  permissions: PermissionValues[];
  ugTeams: UgTeamValues[];
  guestTeams: GuestTeamValues[];
  crewMembers: CrewMemberValues[];
  shortResearchEquipments: ShortResearchEquipmentValues[];
  longResearchEquipments: LongResearchEquipmentValues[];
  ports: PortCallValues[];
  cruiseDaysDetails: CruiseDayValues[];
  researchEquipments: ResearchEquipmentValues[];
  shipEquipmentsIds: string[];
};
