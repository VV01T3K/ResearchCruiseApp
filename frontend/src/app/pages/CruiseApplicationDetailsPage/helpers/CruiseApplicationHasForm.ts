import {useContext} from 'react';
import {CruiseApplicationContext} from '@contexts/CruiseApplicationContext';

export const cruiseApplicationHasForm = (formType: string) => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext);
    switch (formType) {
        case 'A':
            return !cruiseApplicationContext!.hasFormA;
        case 'B':
            return !cruiseApplicationContext!.hasFormB;
        case 'C':
            return !cruiseApplicationContext!.hasFormC;
    }
};