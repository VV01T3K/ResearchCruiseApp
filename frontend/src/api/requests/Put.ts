import Api from '@api/Api';
import {Guid} from 'Guid';
import {AxiosRequestConfig} from 'axios';

const put = (url: string, data?: any, config?: AxiosRequestConfig) =>
  Api.put(url, data, config);
export const autoAddCruises = () => put('/api/Cruises/autoAdded');

export const putFormA = (data: any, id: Guid, isDraft: boolean) =>
  put(`/api/CruiseApplications/${id}/FormA?isDraft=${isDraft}`, data);

export const refillFormB = (id: Guid) =>
  put(`/api/CruiseApplications/${id}/FormB/Refill`);

export const refillFormC = (id: Guid) =>
  put(`/api/CruiseApplications/${id}/FormC/Refill`);

export const confirmCruise = (id: Guid) =>
  put(`/api/Cruises/${id}/confirm`, { raw: true });

export const putFormB = (
  cruiseApplicationId: Guid,
  data: any,
  isDraft: boolean
) =>
  put(
    `/api/CruiseApplications/${cruiseApplicationId}/FormB?isDraft=${isDraft}`,
    data
  );

export const endCruise = (id: Guid) => put(`/api/Cruises/${id}/end`);
