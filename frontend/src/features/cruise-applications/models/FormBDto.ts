import { CrewMemberDto } from '@/features/cruise-applications/models/CrewMemberDto';
import { CruiseDayDetailsDto } from '@/features/cruise-applications/models/CruiseDayDetailsDto';
import { GuestTeamDto } from '@/features/cruise-applications/models/GuestTeamDto';
import { LongResearchEquipmentDto } from '@/features/cruise-applications/models/LongResearchEquipmentDto';
import { PermissionDto } from '@/features/cruise-applications/models/PermissionDto';
import { PortDto } from '@/features/cruise-applications/models/PortDto';
import { ResearchEquipmentDto } from '@/features/cruise-applications/models/ResearchEquipmentDto';
import { ShortResearchEquipmentDto } from '@/features/cruise-applications/models/ShortResearchEquipmentDto';
import { UGTeamDto } from '@/features/cruise-applications/models/UGTeamDto';

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
