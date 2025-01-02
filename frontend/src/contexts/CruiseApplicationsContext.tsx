import React, {createContext} from 'react';
import {CruiseApplication} from 'CruiseApplication';

export const CruiseApplicationsContext = createContext<{
  cruiseApplications: CruiseApplication[];
  setCruiseApplications: React.Dispatch<
    React.SetStateAction<CruiseApplication[]>
  >;
} | null>(null);
