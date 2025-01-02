import {extendedUseLocation} from '@hooks/extendedUseLocation';
import {CruiseApplication} from 'CruiseApplication';

const cruiseApplicationFromLocation = () => {
    const location = extendedUseLocation();
    return location?.state?.cruiseApplication as CruiseApplication;
};

export default cruiseApplicationFromLocation;