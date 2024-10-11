import { createContext } from 'react';

import { ExtendedUseFormReturn } from '../types/ExtendedUseFormReturn';

export const FormContext = createContext<ExtendedUseFormReturn | null>(null);