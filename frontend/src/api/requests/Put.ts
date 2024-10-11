import Api from '@api/Api';

export const autoAddCruises = () => Api.put('/api/Cruises/autoAdded');