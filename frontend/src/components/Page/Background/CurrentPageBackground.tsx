import { useEffect, useState } from 'react';
import UserDataManager, { IsUserLoggedIn } from '../../../ToBeMoved/CommonComponents/UserDataManager';

export const CurrentPageBackground = () => {
    const [pageBackground, _setpageBackground] = useState<string>('default-bg');
    const { UserLoggedIn } = UserDataManager();

    const setPageBackground = () => {
        let image = 'default-bg';
        if (!IsUserLoggedIn()) {
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
