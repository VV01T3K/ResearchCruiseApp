import CruiseApplicationInfo from '../../CruiseApplicationInfo';

import {SectionWrapper} from '@components/Form/Section/SectionWrapper';

export const CruiseApplicationDetailsSection = () =>
    SectionWrapper({
        shortTitle: 'Informacje',
        longTitle: 'Informacje o zgłoszeniu',
        children: <CruiseApplicationInfo />,
    });
