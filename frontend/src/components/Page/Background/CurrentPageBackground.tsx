import { useEffect, useState } from 'react';
import UserDataManager, { IsUserLoggedIn } from '../../../ToBeMoved/CommonComponents/UserDataManager';
import { extendedUseLocation } from '@hooks/extendedUseLocation';

export const CurrentPageBackground = () => {
    const [pageBackground, _setpageBackground] = useState<string>('default-bg');
    const { UserLoggedIn } = UserDataManager();
    const location = extendedUseLocation();

    const setPageBackground = () => {
        let image = 'default-bg';
        if (!IsUserLoggedIn()) {
            image = 'default-bg-stretch';
        } else {
            image = 'defualt-bg-logged-in';
        }

        if (pageBackground != image) {
            _setpageBackground(image);
        }
    };

    useEffect(() => {
        setPageBackground();
    });

    return { pageBackgroundImage: pageBackground };
};
