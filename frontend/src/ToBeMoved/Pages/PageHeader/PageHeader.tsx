import {useState} from 'react';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import PageHeaderText from '../../Tools/PageHeaderText';
import {UgPageLink} from './PageHeaderCommon';


type Props = {
    className?: string,
}


function PageHeader(props: Props) {
    const [toggledButton, setToggle] = useState(false);
    const { pageHeaderText } = PageHeaderText();

    const AppTopBar = () => {
        return (
            <div className={props.className + ' app-top-bar'}>
                <UgPageLink />
                {pageHeaderText}
                <button className="display-on-mobile mobile-menu-button" onClick={() => setToggle(!toggledButton)} />
                <div className="display-on-desktop desktop-menu"><DesktopMenu /></div>
            </div>
        );
    };

    return (
        <div className="fixed-top">
            <AppTopBar />
            <div className="app-top-bar-spacing" />
            <div className={`${toggledButton ? 'display-on-mobile mobile-submenu' : 'd-none'}`}>
                <MobileMenu />
            </div>
        </div>
    );
}


export default PageHeader;