import { createContext } from 'react';
import { CruiseApplication } from '../types/CruiseApplication';

export const CruiseApplicationContext = createContext<CruiseApplication | null>(
    null,
);