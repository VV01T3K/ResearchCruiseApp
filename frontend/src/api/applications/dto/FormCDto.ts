import { CollectedSampleDto } from '@/api/applications/dto/CollectedSampleDto';
import { ContractDto } from '@/api/applications/dto/ContractDto';
import { CruiseDayDetailsDto } from '@/api/applications/dto/CruiseDayDetailsDto';
import { FileDto } from '@/api/applications/dto/FileDto';
import { GuestTeamDto } from '@/api/applications/dto/GuestTeamDto';
import { LongResearchEquipmentDto } from '@/api/applications/dto/LongResearchEquipmentDto';
import { PermissionDto } from '@/api/applications/dto/PermissionDto';
import { PortDto } from '@/api/applications/dto/PortDto';
import { ResearchAreaDescriptionDto } from '@/api/applications/dto/ResearchAreaDescriptionDto';
import { ResearchEquipmentDto } from '@/api/applications/dto/ResearchEquipmentDto';
import { ResearchTaskEffectDto } from '@/api/applications/dto/ResearchTaskEffectDto';
import { ShortResearchEquipmentDto } from '@/api/applications/dto/ShortResearchEquipmentDto';
import { SpubTaskDto } from '@/api/applications/dto/SpubTaskDto';
import { UGTeamDto } from '@/api/applications/dto/UGTeamDto';

export type FormCDto = {
  shipUsage: string; // Max length 1
  differentUsage: string; // Max length 1024
  permissions: PermissionDto[];
  researchAreaDescriptions: ResearchAreaDescriptionDto[];
  ugTeams: UGTeamDto[];
  guestTeams: GuestTeamDto[];
  researchTasksEffects: ResearchTaskEffectDto[];
  contracts: ContractDto[];
  spubTasks: SpubTaskDto[];
  shortResearchEquipments: ShortResearchEquipmentDto[];
  longResearchEquipments: LongResearchEquipmentDto[];
  ports: PortDto[];
  cruiseDaysDetails: CruiseDayDetailsDto[];
  researchEquipments: ResearchEquipmentDto[];
  shipEquipmentsIds: string[];
  collectedSamples: CollectedSampleDto[];
  spubReportData?: string; // Max length 10240
  additionalDescription?: string; // Max length 10240
  photos: FileDto[];
};
