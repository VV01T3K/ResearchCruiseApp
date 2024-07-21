import React from 'react';
import UserDataManager from "../../CommonComponents/UserDataManager";
import {HomeLink, LogoutLink, OutlookLink, RadioMorsLink} from "./PageHeaderCommon";



function DesktopMenu(){
    const {UserLoggedIn} = UserDataManager()
    return (
        <div className="row d-flex align-items-center">
            <div className="col text-center border-end border-light">
                <RadioMorsLink/>
            </div>
            <div className="col text-center border-end border-light">
                <OutlookLink/>
            </div>
            <div className={`col text-center ${UserLoggedIn() ? "border-end border-light ":""}`}>
                <HomeLink/>
            </div>
            {UserLoggedIn() &&    <div className="col text-center">
                <LogoutLink/>
            </div>}
        </div>
    )
}


export default DesktopMenu