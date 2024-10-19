import useCustomEvent from '../Tools/useCustomEvent';
import { useContext, useEffect, useState } from 'react';


import { extendedUseLocation } from '@hooks/extendedUseLocation';
import { BusyContext } from '@contexts/BusyContext';

const BusyEvent = () => {
    const [busyMessage, setBusyMessage] = useContext(BusyContext)!;
    const location = extendedUseLocation();

    const ResetBusyState = () => setBusyMessage(null);

    return {
        ResetBusyState,
        SetBusyWithMessage: setBusyMessage,
        isBusy: busyMessage !== null,
        BusyMessage: busyMessage,
    };
};
export default BusyEvent;
