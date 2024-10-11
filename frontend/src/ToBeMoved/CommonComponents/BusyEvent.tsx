import useCustomEvent from '../Tools/useCustomEvent';
import { useEffect, useState } from 'react';


import { extendedUseLocation } from '@hooks/extendedUseLocation';

// TODO: Change to use context
const BusyEvent = () => {
    const { dispatchEvent, addEventListener: busyListener } =
        useCustomEvent('busy');

    const [isBusy, setIsBusy] = useState<null | string>(null);
    useEffect(() => {
        const unsubscribeBusy = busyListener((data: null | string) => {
            setIsBusy(data);
        });
        return () => {
            unsubscribeBusy();
        };
    }, [busyListener]);

    const location = extendedUseLocation();
    useEffect(() => {
        ResetBusyState();
    }, [location]);
    const ResetBusyState = () => dispatchEvent(null);
    const SetBusyWithMessage = (message: string) => dispatchEvent(message);

    const DisplayIfBuisy = () => {
        return isBusy ? '' : 'd-none';
    };
    const DisplayIfNotBuisy = () => {
        return !isBusy ? '' : 'd-none';
    };

    return {
        ResetBusyState,
        SetBusyWithMessage,
        isBusy,
        DisplayIfNotBuisy,
        DisplayIfBuisy,
    };
};
export default BusyEvent;
