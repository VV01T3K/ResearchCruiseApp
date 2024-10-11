import { extendedUseLocation } from '@hooks/extendedUseLocation';
import { CruiseApplication } from '@types/CruiseApplication';

const cruiseApplicationFromLocation = () => {
    const location = extendedUseLocation();
    return location?.state?.cruiseApplication as CruiseApplication;
};

export default cruiseApplicationFromLocation;