import {createContext} from 'react';
import {CruiseApplicationListMode} from 'CruiseApplicationListMode';

export const ListModeContext = createContext<null | {
    mode?: CruiseApplicationListMode;
}>(null);