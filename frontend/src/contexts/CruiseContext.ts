import { createContext } from 'react';

import { FormContextFields } from '@app/pages/FormPage/Wrappers/FormTemplate';
import { Cruise } from 'Cruise';

export const CruiseContext = createContext<Cruise | undefined>(undefined);