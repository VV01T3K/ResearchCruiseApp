import {CruiseAndDeputyManager} from './CruiseManagerSectionFields';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';

export const cruiseManagerSectionFieldNames = {
    cruiseManagerId: 'cruiseManagerId',
    deputyManagerId: 'deputyManagerId',
    year: 'year',
};

export const CruiseManagerSection = () => SectionWrapper(
    {
        shortTitle: 'Kierownik',
        longTitle: 'Kierownik zgłaszanego rejsu',
        sectionFieldNames: cruiseManagerSectionFieldNames,
        children: <CruiseAndDeputyManager />,
    },
);