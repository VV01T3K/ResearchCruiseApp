import Api from '@api/Api';
import {AxiosRequestConfig} from 'axios';

const _delete = (url: string, config?: AxiosRequestConfig) =>
  Api.delete(url, config);
export const deleteCruise = (id: string) => _delete(`/api/Cruises/${id}`);
