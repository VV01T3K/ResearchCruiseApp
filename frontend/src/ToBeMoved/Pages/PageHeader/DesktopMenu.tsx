import UserDataManager from '../../CommonComponents/UserDataManager';
import {HomeLink, LogoutLink, OutlookLink, RadioMorsLink} from './PageHeaderCommon';

function DesktopMenu() {
    const { UserLoggedIn } = UserDataManager();
    return (
        <>
            <RadioMorsLink className="desktop-menu-button" />
            <OutlookLink className="desktop-menu-button" />
            <HomeLink className={UserLoggedIn() ? 'desktop-menu-button' : 'desktop-menu-last-button'} />
            {UserLoggedIn() && <LogoutLink className="desktop-menu-last-button" />}
        </>
    );
}


export default DesktopMenu;