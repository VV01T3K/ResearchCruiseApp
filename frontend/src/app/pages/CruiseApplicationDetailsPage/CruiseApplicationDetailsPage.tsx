import React from 'react';
import FormTemplate from '../FormPage/Wrappers/FormTemplate';
import { formType } from '../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import {
    CruiseApplicationContext,
} from '@contexts/CruiseApplicationContext';
import { CruiseApplicationDetailsSections } from './CruiseApplicationDetailsSections';
import { BottomOptionBar } from '../../../ToBeMoved/Tools/CruiseApplicationBottomOptionBar';
import cruiseApplicationFromLocation from '@hooks/cruiseApplicationFromLocation';

import { extendedUseLocation } from '@hooks/extendedUseLocation';


function CruiseApplicationDetailsPage() {
    const cruiseApplication = cruiseApplicationFromLocation();
    const sections = CruiseApplicationDetailsSections();

    return (
        <CruiseApplicationContext.Provider
            value={cruiseApplication}
        >
            <FormTemplate
                type={formType.ApplicationDetails}
                sections={sections}
                BottomOptionBar={BottomOptionBar}
            />
        </CruiseApplicationContext.Provider>
    );
}

export default CruiseApplicationDetailsPage;
