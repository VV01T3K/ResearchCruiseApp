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

export const getFormB = (cruiseApplicationId: Guid) =>
    get(`/api/CruiseApplications/${cruiseApplicationId}/formB`);

export const fetchCruises = () => Api.get('/api/Cruises');

export const getFormAInitValues = () => get('/Forms/InitValues/A');

export const getFormBInitValues = () => get('/Forms/InitValues/B');

export const getApplicationDetails = (cruiseApplicationId: Guid) => get(`/api/CruiseApplications/${cruiseApplicationId}/evaluation`);

export const getFormAInitValuesForSupervisor = (cruiseApplicationId: Guid, supervisorCode: Guid) =>
    get(`/Forms/InitValuesForSupervisor/A?cruiseApplicationId=${cruiseApplicationId}&supervisorCode=${supervisorCode}`);