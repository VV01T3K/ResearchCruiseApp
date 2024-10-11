import Api from '../Api';
import { Guid } from 'Guid';

const get = (url: string) => Api.get(url);

export const getFormForSupervisor = (
    cruiseApplicationId: Guid,
    supervisorCode: string,
) =>
    get(
        `/api/CruiseApplications/${cruiseApplicationId}
        /formAForSupervisor?supervisorCode=${supervisorCode}`,
    );

export const getFormA = (cruiseApplicationId: Guid) =>
    get(`/api/CruiseApplications/${cruiseApplicationId}/formA`);
export const fetchCruises = () => Api.get('/api/Cruises');