import { CollectedSampleDto } from '@/api/dto/applications/CollectedSampleDto';
import { ContractDto } from '@/api/dto/applications/ContractDto';
import { CruiseDayDetailsDto } from '@/api/dto/applications/CruiseDayDetailsDto';
import { FileDto } from '@/api/dto/applications/FileDto';
import { GuestTeamDto } from '@/api/dto/applications/GuestTeamDto';
import { LongResearchEquipmentDto } from '@/api/dto/applications/LongResearchEquipmentDto';
import { PermissionDto } from '@/api/dto/applications/PermissionDto';
import { PortDto } from '@/api/dto/applications/PortDto';
import { ResearchAreaDescriptionDto } from '@/api/dto/applications/ResearchAreaDescriptionDto';
import { ResearchEquipmentDto } from '@/api/dto/applications/ResearchEquipmentDto';
import { ResearchTaskEffectDto } from '@/api/dto/applications/ResearchTaskEffectDto';
import { ShortResearchEquipmentDto } from '@/api/dto/applications/ShortResearchEquipmentDto';
import { SpubTaskDto } from '@/api/dto/applications/SpubTaskDto';
import { UGTeamDto } from '@/api/dto/applications/UGTeamDto';

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
