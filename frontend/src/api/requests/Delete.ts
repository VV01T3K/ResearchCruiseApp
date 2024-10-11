import Api from '@api/Api';

export const deleteCruise = (id: string) => Api.delete(`/api/Cruises/${id}`);