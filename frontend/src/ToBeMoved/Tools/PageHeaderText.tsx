import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Path as Path } from './Path';
import UserDataManager from '../CommonComponents/UserDataManager';

const PageHeaderText = () => {
    const [pageHeaderText, _setPageHeaderText] = useState<string | null>(null);
    const { userData, UserLoggedIn } = UserDataManager();
    const location = useLocation();
    const setPageHeaderText = () => {
        let text = null;
        switch (location.pathname) {
            case Path.NewForm:
                break;
            default:
                if (UserLoggedIn() && userData) {
                    text = `Witaj, ${userData!.firstName}`;
                }
                break;
        }
        _setPageHeaderText(text);
    };

    useEffect(() => {
        setPageHeaderText();
    }, [location, UserLoggedIn, 'load']);

    return { pageHeaderText };
};
export default PageHeaderText;
