import { createContext } from 'react';
import { CruiseApplicationListMode } from '../types/CruiseApplicationListMode';

export const ListModeContext = createContext<null | {
    mode?: CruiseApplicationListMode;
}>(null);