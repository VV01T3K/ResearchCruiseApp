import { cruiseFromLocation } from '@hooks/cruiseFromLocation';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import CruiseBasicInfo from '@app/pages/CruiseFormPage/CruiseFormSections/CruiseBasicInfo';
import {
    CruiseApplicationCruiseManagerName,
} from '@app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsFields/CruiseApplicationCruiseManagerName';
import {
    CruiseApplicationDeputyManagerName,
} from '@app/pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsFields/CruiseApplicationDeputyManagerName';
import FormRadio from '@app/pages/FormPage/Inputs/FormRadio';
import BoolField from '@app/pages/FormPage/Inputs/BoolField';

const cruiseManagerSectionFieldNames = {
    isCruiseManagerPresent: 'isCruiseManagerPresent',
};
export const BasicInfo = () => {
    const cruise = cruiseFromLocation();
    return (
        <CruiseBasicInfo cruise={cruise} />
    );
};

const IsCruiseManagerPresentField = () => {
    return (
        <BoolField fieldLabel={'Czy kierownik obecny jest na rejsie'}
                   fieldName={cruiseManagerSectionFieldNames.isCruiseManagerPresent}
                   defaultValue={'true'}
        />
    );
};

export const CruiseManagersSection = () => SectionWrapper(
    {
        shortTitle: 'Kierownik',
        longTitle: 'Kierownik zgłaszanego rejsu',
        sectionFieldNames: cruiseManagerSectionFieldNames,
        children:
            <>
                <CruiseApplicationCruiseManagerName />
                <CruiseApplicationDeputyManagerName />
                <IsCruiseManagerPresentField />
            </>,
    },
);
