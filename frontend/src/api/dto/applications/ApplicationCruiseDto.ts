import { CruiseApplicationShortInfoDto } from '@/api/dto/applications/CruiseApplicationShortInfoDto';

export type ApplicationCruiseDto = {
  id: string;
  number: string;
  startDate: string;
  endDate: string;
  mainCruiseManagerId: string;
  mainCruiseManagerFirstName: string;
  mainCruiseManagerLastName: string;
  mainDeputyManagerId: string;
  cruiseApplicationsShortInfo: CruiseApplicationShortInfoDto[];
  status: 'Nowy' | 'Potwierdzony' | 'Zakończony';
};
