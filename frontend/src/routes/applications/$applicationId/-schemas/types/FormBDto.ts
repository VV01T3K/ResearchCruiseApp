import { CrewMemberDto } from './CrewMemberDto';
import { CruiseDayDetailsDto } from './CruiseDayDetailsDto';
import { GuestTeamDto } from './GuestTeamDto';
import { LongResearchEquipmentDto } from './LongResearchEquipmentDto';
import { PermissionDto } from './PermissionDto';
import { PortDto } from './PortDto';
import { ResearchEquipmentDto } from './ResearchEquipmentDto';
import { ShortResearchEquipmentDto } from './ShortResearchEquipmentDto';
import { UGTeamDto } from './UGTeamDto';

export type FormBDto = {
  isCruiseManagerPresent: 'true' | 'false';
  permissions: PermissionDto[];
  ugTeams: UGTeamDto[];
  guestTeams: GuestTeamDto[];
  crewMembers: CrewMemberDto[];
  shortResearchEquipments: ShortResearchEquipmentDto[];
  longResearchEquipments: LongResearchEquipmentDto[];
  ports: PortDto[];
  cruiseDaysDetails: CruiseDayDetailsDto[];
  researchEquipments: ResearchEquipmentDto[];
  shipEquipmentsIds: string[];
};
