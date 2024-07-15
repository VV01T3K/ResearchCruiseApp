import useCustomEvent from "../Tools/useCustomEvent";
import {useEffect, useState} from "react";
import {faBuildingShield} from "@fortawesome/free-solid-svg-icons";

const BusyEvent = () => {

    const { dispatchEvent, addEventListener:busyListener } = useCustomEvent('busy')

    const [isBusy, setIsBusy] = useState<null|string>(null)
    useEffect(()=>{
        const unsubscribeBusy = busyListener((data:null|string) => {
            setIsBusy(data)
        });
        return () => {
            unsubscribeBusy();
        };
    }, [busyListener])
    const ResetBusyState = () =>
        dispatchEvent(null)
    const SetBusyWithMessage = (message:string) =>
        dispatchEvent(message)

    return {ResetBusyState, SetBusyWithMessage, isBusy}
}
export default BusyEvent
