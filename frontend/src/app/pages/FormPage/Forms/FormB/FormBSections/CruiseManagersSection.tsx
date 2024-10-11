import { cruiseFromLocation } from '@hooks/cruiseFromLocation';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import CruiseBasicInfo from '@app/pages/CruiseFormPage/CruiseFormSections/CruiseBasicInfo';
import {
    CruiseApplicationCruiseManagerName,
} from '@app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsFields/CruiseApplicationCruiseManagerName';
import {
    CruiseApplicationDeputyManagerName,
} from '@app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsFields/CruiseApplicationDeputyManagerName';


export const BasicInfo = () => {
    const cruise = cruiseFromLocation();
    return (
        <CruiseBasicInfo cruise={cruise} />
    );
};


export const CruiseManagersSection = () => SectionWrapper(
    {
        shortTitle: 'Kierownik',
        longTitle: 'Kierownik zgłaszanego rejsu',
        children:
            <>
                <CruiseApplicationCruiseManagerName />
                <CruiseApplicationDeputyManagerName />
            </>,
    },
);
