import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import useCustomEvent from "../../Tools/useCustomEvent";
import UserDataManager from "../../CommonComponents/UserDataManager";


type Props = {
    className?: string
}


function DesktopMenu(props: Props){
    const loggedIn = sessionStorage.getItem("accessToken") ?? false
    const {Logout} = UserDataManager()
    return (
        <div className="row d-flex">
            <div className="col text-center border-end border-light">
                <Link id="radiomors"
                      to=""
                      onClick={() => window.open(
                          'http://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html',
                          'newWin',
                          'width=280,height=220'
                      )}
                      tabIndex={1}
                      title="Słucha Radia MORS"
                >
                    <img alt="Radio MORS" src="https://ug.edu.pl/themes/ug_faculty/images/radio.svg" />
                </Link>
            </div>
            <div className="col text-center border-end border-light">
                <Link to="https://outlook.com/ug.edu.pl"
                      id="webmail"
                      title="Poczta uniwersytecka"
                >
                    <img alt="Poczta UG" src="https://ug.edu.pl/themes/ug_faculty/images/mail.svg" />
                </Link>
            </div>
            <div className={`col text-center ${loggedIn ? "border-end border-light ":""}`}>
                <Link to="/"
                      id="english"
                      lang="en"
                      title="English Version"
                      tabIndex={0}
                      style={{"textDecoration":"none", "fontSize": "20px","fontWeight": "500","color": "white"}}
                >
                    HOME
                </Link>
            </div>
            {loggedIn &&    <div className="col text-center">
                <Link onClick={Logout} to="/"
                      style={{"textDecoration":"none", "fontSize": "20px","color": "white"}}
                >
                    Wyloguj
                </Link>
            </div>}
        </div>
    )
}


export default DesktopMenu