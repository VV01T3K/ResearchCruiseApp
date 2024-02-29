import { useEffect, useRef } from 'react';

const useCustomEvent = (eventName) => {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = new CustomEvent(eventName);
        return () => {
            ref.current = null;
        };
    }, [eventName]);

    const dispatchEvent = (data) => {
        if (ref.current) {
            document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
        }
    };

    const addEventListener = (callback) => {
        const eventHandler = (event) => {
            callback(event.detail);
        };

        document.addEventListener(eventName, eventHandler);

        return () => {
            document.removeEventListener(eventName, eventHandler);
        };
    };

    return { dispatchEvent, addEventListener };
};

export default useCustomEvent;