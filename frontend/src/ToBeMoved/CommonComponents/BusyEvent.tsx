import { BusyContext } from '@contexts/BusyContext';
import { extendedUseLocation } from '@hooks/extendedUseLocation';
import { useContext } from 'react';

const BusyEvent = () => {
    const [busyMessage, setBusyMessage] = useContext(BusyContext)!;
    extendedUseLocation();

    const ResetBusyState = () => setBusyMessage(null);

    return {
        ResetBusyState,
        SetBusyWithMessage: setBusyMessage,
        isBusy: busyMessage !== null,
        BusyMessage: busyMessage,
    };
};
export default BusyEvent;
