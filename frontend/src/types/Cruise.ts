import {CruiseApplication} from 'CruiseApplication';
import {CruiseApplicationShortInfo} from 'CruiseApplicationShortInfo';
import {CruiseStatus} from '@enums/CruiseStatus';

export type Cruise = {
    id: string;
    number: string;
    startDate: string;
    endDate: string;
    mainCruiseManagerId: string;
    mainCruiseManagerFirstName: string;
    mainCruiseManagerLastName: string;
    mainDeputyManagerId: string;
    cruiseApplicationsShortInfo: CruiseApplicationShortInfo[];
    cruiseApplications?: CruiseApplication[];
    status: CruiseStatus;
};
