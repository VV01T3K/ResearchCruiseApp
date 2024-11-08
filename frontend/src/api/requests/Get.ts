import Api from '../Api';
import { Guid } from 'Guid';
import { AxiosRequestConfig } from 'axios';

const get = (url: string, config?: AxiosRequestConfig) => Api.get(url, config);

export const getFormForSupervisor = (
  cruiseApplicationId: Guid,
  supervisorCode: string
) =>
  get(
    `/api/CruiseApplications/${cruiseApplicationId}
        /formAForSupervisor?supervisorCode=${supervisorCode}`
  );

export const getFormA = (cruiseApplicationId: Guid) =>
  get(`/api/CruiseApplications/${cruiseApplicationId}/formA`);

export const getFormB = (cruiseApplicationId: Guid) =>
  get(`/api/CruiseApplications/${cruiseApplicationId}/formB`);

export const getFormC = (cruiseApplicationId: Guid) =>
  get(`/api/CruiseApplications/${cruiseApplicationId}/formC`);

export const fetchCruises = () => get('/api/Cruises');

export const getFormAInitValues = () => get('/Forms/InitValues/A');

export const getFormBInitValues = () => get('/Forms/InitValues/B');

export const getFormCInitValues = () => get('/Forms/InitValues/C');

export const getApplicationDetails = (cruiseApplicationId: Guid) =>
  get(`/api/CruiseApplications/${cruiseApplicationId}/evaluation`);

export const getFormAInitValuesForSupervisor = (
  cruiseApplicationId: Guid,
  supervisorCode: Guid
) =>
  get(
    `/Forms/InitValuesForSupervisor/A?cruiseApplicationId=${cruiseApplicationId}&supervisorCode=${supervisorCode}`
  );

export const getCruiseForCruiseApplication = (id: Guid) =>
  get(`/api/CruiseApplications/${id}/cruise`);

export const getCruise = (id: Guid) => get(`/api/Cruises/${id}`);

export const getAccountData = () => get('/account');

export const getEmailConfirmation = (
  userId: Guid | null,
  code: string | null
) =>
  get(`/account/emailConfirmation?userId=${userId}&code=${code}`, {
    raw: true,
  });

export const getUsers = () => get('/Users');

export const getCruiseApplication = (id: Guid) =>
  get(`/api/CruiseApplications/${id}`);

export const getCruiseApplications = () => get('/api/CruiseApplications');

export const getCruiseApplicationsForCruise = (cruiseIsNew: boolean) =>
  get(
    cruiseIsNew
      ? '/api/CruiseApplications/forCruise'
      : '/api/CruiseApplications'
  );
