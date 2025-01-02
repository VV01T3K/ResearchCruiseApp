import {createContext} from 'react';
import {Cruise} from 'Cruise';

export const CruiseContext = createContext<Cruise | undefined>(undefined);