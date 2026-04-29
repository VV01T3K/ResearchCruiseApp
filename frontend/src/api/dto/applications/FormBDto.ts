import { CrewMemberDto } from '@/api/dto/applications/CrewMemberDto';
import { CruiseDayDetailsDto } from '@/api/dto/applications/CruiseDayDetailsDto';
import { GuestTeamDto } from '@/api/dto/applications/GuestTeamDto';
import { LongResearchEquipmentDto } from '@/api/dto/applications/LongResearchEquipmentDto';
import { PermissionDto } from '@/api/dto/applications/PermissionDto';
import { PortDto } from '@/api/dto/applications/PortDto';
import { ResearchEquipmentDto } from '@/api/dto/applications/ResearchEquipmentDto';
import { ShortResearchEquipmentDto } from '@/api/dto/applications/ShortResearchEquipmentDto';
import { UGTeamDto } from '@/api/dto/applications/UGTeamDto';

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
