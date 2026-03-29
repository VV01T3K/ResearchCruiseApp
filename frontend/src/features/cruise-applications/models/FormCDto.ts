import { CollectedSampleDto } from '@/features/cruise-applications/models/CollectedSampleDto';
import { ContractDto } from '@/features/cruise-applications/models/ContractDto';
import { CruiseDayDetailsDto } from '@/features/cruise-applications/models/CruiseDayDetailsDto';
import { FileDto } from '@/features/cruise-applications/models/FileDto';
import { GuestTeamDto } from '@/features/cruise-applications/models/GuestTeamDto';
import { LongResearchEquipmentDto } from '@/features/cruise-applications/models/LongResearchEquipmentDto';
import { PermissionDto } from '@/features/cruise-applications/models/PermissionDto';
import { PortDto } from '@/features/cruise-applications/models/PortDto';
import { ResearchAreaDescriptionDto } from '@/features/cruise-applications/models/ResearchAreaDescriptionDto';
import { ResearchEquipmentDto } from '@/features/cruise-applications/models/ResearchEquipmentDto';
import { ResearchTaskEffectDto } from '@/features/cruise-applications/models/ResearchTaskEffectDto';
import { ShortResearchEquipmentDto } from '@/features/cruise-applications/models/ShortResearchEquipmentDto';
import { SpubTaskDto } from '@/features/cruise-applications/models/SpubTaskDto';
import { UGTeamDto } from '@/features/cruise-applications/models/UGTeamDto';

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
