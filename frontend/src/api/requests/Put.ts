import Api from '@api/Api';
import { Guid } from 'Guid';

export const autoAddCruises = () => Api.put('/api/Cruises/autoAdded');

export const refillFormB = (id: Guid) => Api.put(`/api/CruiseApplications/${id}/FormB/Refill`);

export const refillFormC = (id: Guid) => Api.put(`/api/CruiseApplications/${id}/FormC/Refill`);
