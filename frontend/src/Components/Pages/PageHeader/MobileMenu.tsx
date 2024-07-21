import React from 'react';
import {HomeLink, LogoutLink, OutlookLink, RadioMorsLink} from "./PageHeaderCommon";
import UserDataManager from "../../CommonComponents/UserDataManager";

function MobileMenu() {
    const {UserLoggedIn} = UserDataManager()
    return (
        <div className="flex-row d-flex align-items-center">
            <div className={`${UserLoggedIn() ? "col-3": "col-4"} text-center`}>
                <RadioMorsLink/>
            </div>
            <div className={`${UserLoggedIn() ? "col-3": "col-4"} text-center`}>
              <OutlookLink/>
            </div>
            <div className={`${UserLoggedIn() ? "col-3": "col-4"} text-center`}>
                <HomeLink/>
            </div>
            {UserLoggedIn() &&
            <div className="col-3 text-center">
               <LogoutLink/>
            </div>
            }
        </div>
    )
}


export default MobileMenu