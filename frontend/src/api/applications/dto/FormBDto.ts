import { CrewMemberDto } from '@/api/applications/dto/CrewMemberDto';
import { CruiseDayDetailsDto } from '@/api/applications/dto/CruiseDayDetailsDto';
import { GuestTeamDto } from '@/api/applications/dto/GuestTeamDto';
import { LongResearchEquipmentDto } from '@/api/applications/dto/LongResearchEquipmentDto';
import { PermissionDto } from '@/api/applications/dto/PermissionDto';
import { PortDto } from '@/api/applications/dto/PortDto';
import { ResearchEquipmentDto } from '@/api/applications/dto/ResearchEquipmentDto';
import { ShortResearchEquipmentDto } from '@/api/applications/dto/ShortResearchEquipmentDto';
import { UGTeamDto } from '@/api/applications/dto/UGTeamDto';

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
