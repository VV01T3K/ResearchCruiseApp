import {useLocation} from 'react-router-dom';
import {Buffer} from 'buffer';

export const extendedUseLocation = () => {
    const location = useLocation();
    if (location.state) {
        return location;
    }

    const queryParams = new URLSearchParams(window.location.search);
    const dataParam = queryParams.get('data');
    if (dataParam) {
        try {
            const stateJSON = Buffer.from(dataParam, 'base64').toString();
            const state = JSON.parse(stateJSON);
            return { state: state };
        } catch (e) {
            return undefined;
        }
    }
    return undefined;
};