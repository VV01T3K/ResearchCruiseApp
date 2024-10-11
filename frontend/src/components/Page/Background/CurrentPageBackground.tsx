import { useEffect, useState } from 'react';
import UserDataManager from '../../../ToBeMoved/CommonComponents/UserDataManager';

export const CurrentPageBackground = () => {
    const [pageBackground, _setpageBackground] = useState<string>('default-bg');
    const { UserLoggedIn } = UserDataManager();
    const setPageBackground = () => {
        let image = 'default-bg';
        if (!UserLoggedIn()) {
            image = 'default-bg-stretch';
        }

        if (pageBackground != image) {
            _setpageBackground(image);
        }
    };

    useEffect(() => {
        setPageBackground();
    }, [location, UserLoggedIn, 'load']);

    return { pageBackgroundImage: pageBackground };
};
