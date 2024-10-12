import React, { createContext, useEffect, useState } from 'react';
import FormTemplate from '../FormPage/Wrappers/FormTemplate';
import { ApplicationsSection } from './CruiseFormSections/Sections/AppicationsSection';
import { DateSection } from './CruiseFormSections/Sections/InfoSection';
import { CruiseManagersSection } from './CruiseFormSections/Sections/CruiseManagersSection';

import { Cruise } from 'Cruise';
import { InfoSection } from './CruiseFormSections/Sections/DateSection';
import { CruiseFormBottomOptionBar } from '../../../ToBeMoved/Tools/CruiseFormBottomOptionBar';
import Api from '../../../api/Api';
import { FormType, FormTypeKeys } from '../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import { CruiseApplication } from 'CruiseApplication';
import { CruiseStatus } from '@enums/CruiseStatus';
import { EMPTY_GUID } from '@consts/emptyGuid';
import { ApplicationsContext } from '@contexts/ApplicationsContext';
import { cruiseFromLocation } from '@hooks/cruiseFromLocation';

type CruiseManagersTeam = {
    mainCruiseManagerId: string;
    mainDeputyManagerId: string;
};

export type EditCruiseFormValues = {
    startDate: string;
    endDate: string;
    managersTeam: CruiseManagersTeam;
    cruiseApplicationsIds: string[];
};

type CruiseFormPageLocationState = {
    cruise?: Cruise;
};

const CruiseFormSections = () => [
    DateSection(),
    InfoSection(),
    CruiseManagersSection(),
    ApplicationsSection(),
];

const EditCruiseFormDefaultValues = (cruise?: Cruise) => {
    if (cruise) {
        return {
            startDate: new Date(cruise.startDate).toISOString(),
            endDate: new Date(cruise.endDate).toISOString(),
            managersTeam: {
                mainCruiseManagerId: cruise.mainCruiseManagerId,
                mainDeputyManagerId: cruise.mainDeputyManagerId,
            },
            cruiseApplicationsIds: cruise.cruiseApplicationsShortInfo.map(
                (app) => app.id,
            ),
        };
    }
    return {
        startDate: undefined,
        endDate: undefined,
        managersTeam: {
            mainCruiseManagerId: EMPTY_GUID,
            mainDeputyManagerId: EMPTY_GUID,
        },
        cruiseApplicationsIds: [],
    };
};

export const CruiseApplicationsContext = createContext<{
    cruiseApplications: CruiseApplication[];
    setCruiseApplications: React.Dispatch<
        React.SetStateAction<CruiseApplication[]>
    >;
} | null>(null);

export default function CruiseFormPage() {
    const cruise = cruiseFromLocation();
    const editCruiseFormDefaultValues = EditCruiseFormDefaultValues(cruise);
    const sections = CruiseFormSections();
    console.log(cruise);

    const cruiseIsNew = !cruise || cruise?.status == CruiseStatus.New;
    const [fetchedCruiseApplications, setFetchedCruiseApplications] = useState<
        CruiseApplication[]
    >([]);
    useEffect(() => {
        // if (fetchedCruiseApplications.length <= 0) {
        Api.get(
            cruiseIsNew
                ? '/api/CruiseApplications/forCruise'
                : '/api/CruiseApplications',
        ).then((response) => setFetchedCruiseApplications(response?.data));
        // }
    }, []);

    return (
        <ApplicationsContext.Provider
            value={
                fetchedCruiseApplications}
        >
            <FormTemplate
                sections={sections}
                type={FormType.CruiseDetails as FormTypeKeys}
                BottomOptionBar={CruiseFormBottomOptionBar}
                defaultValues={editCruiseFormDefaultValues}
            />
        </ApplicationsContext.Provider>
    );
}
