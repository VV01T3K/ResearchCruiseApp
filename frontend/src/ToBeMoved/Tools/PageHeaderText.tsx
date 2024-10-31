import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Path as Path } from './Path';
import UserDataManager from '../CommonComponents/UserDataManager';

const PageHeaderText = () => {
    const [pageHeaderText, _setPageHeaderText] = useState<string | null>(null);
    const { userData, UserLoggedIn } = UserDataManager();
    const location = useLocation();
    const loggedIn = UserLoggedIn();
    const setPageHeaderText = () => {
        let text = null;
        switch (location.pathname) {
            case Path.Form:
                break;
            case Path.Default:
                if (UserLoggedIn() && userData) {
                    text = `Witaj, ${userData!.firstName}`;
                }
                break;
            default:
                break
        }
        _setPageHeaderText(text);
    };

    useEffect(() => {
        setPageHeaderText();
    }, [location.pathname, loggedIn, 'load']);

    return { pageHeaderText };
};
export default PageHeaderText;
