import { createContext } from 'react';

import { CruiseApplication } from '../types/CruiseApplication';

export const ApplicationsContext = createContext<CruiseApplication[]>([]);