import CruiseBasicInfo from '../CruiseBasicInfo';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';

import {extendedUseLocation} from '@hooks/extendedUseLocation';


export const BasicInfo = () => {
    const locationState = extendedUseLocation();
    return (
        <CruiseBasicInfo cruise={locationState?.state.cruise} />
    );
};

export const InfoSection = () => SectionWrapper(
    {
        shortTitle: 'Podstawowe',
        longTitle: 'Podstawowe informacje o rejsie',
        children: <BasicInfo />,
    },
);