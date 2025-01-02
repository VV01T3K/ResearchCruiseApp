import {HomeLink, LogoutLink, OutlookLink, RadioMorsLink} from './PageHeaderCommon';
import UserDataManager from '../../CommonComponents/UserDataManager';

function MobileMenu() {
    const { UserLoggedIn } = UserDataManager();
    return (
        <>
            <RadioMorsLink
                className={UserLoggedIn() ? 'mobile-menu-logged-in-button' : 'mobile-menu-not-logged-in-button'} />
            <OutlookLink
                className={UserLoggedIn() ? 'mobile-menu-logged-in-button' : 'mobile-menu-not-logged-in-button'} />
            <HomeLink
                className={UserLoggedIn() ? 'mobile-menu-logged-in-button' : 'mobile-menu-not-logged-in-button'} />
            {UserLoggedIn() && <LogoutLink className="mobile-menu-logged-in-button" />}
        </>
    );
}


export default MobileMenu;