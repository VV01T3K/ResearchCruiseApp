import {extendedUseLocation} from '@hooks/extendedUseLocation';

export const supervisorCodeFromLocation = () => {
    const location = extendedUseLocation();
    return location?.state?.supervisorCode;
};