import Api from '@api/Api';
import { Guid } from 'Guid';
import { AxiosRequestConfig } from 'axios';

const put = (url: string, data?: any, config?: AxiosRequestConfig) =>
  Api.put(url, data, config);
export const autoAddCruises = () => put('/api/Cruises/autoAdded');

export const putFormADraft = (data: any, id?: Guid) =>
  put(`/api/CruiseApplications/FormA/${id ? id + '/' : ''}SaveDraft`, data);

export const putFormBDraft = (cruiseApplicationId: Guid, data: any) =>
  put(`/api/CruiseApplications/${cruiseApplicationId}/FormB/Draft`, data);
export const refillFormB = (id: Guid) =>
  put(`/api/CruiseApplications/${id}/FormB/Refill`);

export const refillFormC = (id: Guid) =>
  put(`/api/CruiseApplications/${id}/FormC/Refill`);

export const confirmCruise = (id: Guid) =>
  put(`/api/Cruises/${id}/confirm`, { raw: true });

export const putFormB = (cruiseApplicationId: Guid, data: any) =>
  put(`/api/CruiseApplications/${cruiseApplicationId}/FormB`, data);

export const endCruise = (id: Guid) => put(`/api/Cruises/${id}/end`);
