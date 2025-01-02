import {useEffect, useState} from 'react';

export default function useWindowHeight() {
    const [windowWidth, setWindowWidth] = useState(window.innerHeight);
    const handleResize = () => {
        setWindowWidth(window.innerHeight);
    };
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowWidth;
}
