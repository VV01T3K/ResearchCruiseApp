import { CrewMemberDto } from '@/cruise-applications/models/CrewMemberDto';
import { CruiseDayDetailsDto } from '@/cruise-applications/models/CruiseDayDetailsDto';
import { GuestTeamDto } from '@/cruise-applications/models/GuestTeamDto';
import { LongResearchEquipmentDto } from '@/cruise-applications/models/LongResearchEquipmentDto';
import { PermissionDto } from '@/cruise-applications/models/PermissionDto';
import { PortDto } from '@/cruise-applications/models/PortDto';
import { ResearchEquipmentDto } from '@/cruise-applications/models/ResearchEquipmentDto';
import { ShortResearchEquipmentDto } from '@/cruise-applications/models/ShortResearchEquipmentDto';
import { UGTeamDto } from '@/cruise-applications/models/UGTeamDto';

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
