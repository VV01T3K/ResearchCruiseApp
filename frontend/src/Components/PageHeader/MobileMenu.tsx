import React from 'react';
import {Link} from "react-router-dom";
import useCustomEvent from "../Tools/useCustomEvent";


type Props = {
    className?: string
}


function MobileMenu(props: Props) {
    const loggedIn = sessionStorage.getItem("accessToken") ?? false
    const { dispatchEvent } = useCustomEvent('logoutSuccessful');
    return (
        <div className="flex-row d-flex">
            <div className={`${loggedIn ? "col-3": "col-4"} text-center`}>
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
                    <img alt="Radio MORS" src="https://ug.edu.pl/themes/ug_faculty/images/radio.svg"/>
                </Link>
            </div>
            <div className={`${loggedIn ? "col-3": "col-4"} text-center`}>
                <Link to="https://outlook.com/ug.edu.pl"
                      id="webmail"
                      title="Poczta uniwersytecka"
                >
                    <img alt="Poczta UG" src="https://ug.edu.pl/themes/ug_faculty/images/mail.svg"/>
                </Link>
            </div>
            <div className={`${loggedIn ? "col-3": "col-4"} text-center`}>
                <Link to="/"
                      id="english"
                      lang="en"
                      title="English Version"
                      tabIndex={0}
                      style={{"textDecoration": "none", "fontSize": "20px", "fontWeight": "500", "color": "white"}}
                >
                    HOME
                </Link>
            </div>
            {loggedIn &&
            <div className="col-3 text-center">
                <Link onClick={()=>dispatchEvent(null)} to="/"
                      id="english"
                      lang="en"
                      title="English Version"
                      tabIndex={0}
                      style={{"textDecoration": "none", "fontSize": "20px", "fontWeight": "500", "color": "white"}}
                >
                    Wyloguj
                </Link>
            </div>
            }
        </div>
    )
}


export default MobileMenu