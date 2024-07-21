import {Link} from "react-router-dom";
import React from "react";
import UserDataManager from "../../CommonComponents/UserDataManager";
import Logo from "../../../resources/logo.svg";
import {prop} from "react-data-table-component/dist/DataTable/util";
type Props = {
    className?: string
}
export const RadioMorsLink = (props:Props) => {
    const OpenRadio = () => window.open(
        'http://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html',
        'newWin',
        'width=280,height=220'
    )
    return(
        <Link className={props.className} id="radiomors" to="" onClick={OpenRadio} title="Słucha Radia MORS">
            <img alt="Radio MORS" src="https://ug.edu.pl/themes/ug_faculty/images/radio.svg" />
        </Link>
    )
}
export const OutlookLink = (props:Props) => {
    return (
        <Link className={props.className} to="https://outlook.com/ug.edu.pl" id="webmail" title="Poczta uniwersytecka">
            <img alt="Poczta UG" src="https://ug.edu.pl/themes/ug_faculty/images/mail.svg" />
        </Link>
    )
}

export const HomeLink = (props:Props) => {
    return (
        <Link className={props.className} to="/" id="home" title="Strona domowa"
              style={{"textDecoration": "none", "fontSize": "20px", "fontWeight": "500", "color": "white"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house"
                 viewBox="0 0 16 16">
                <path
                    d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
            </svg>
        </Link>
    )
}

export const LogoutLink = (props:Props) => {
    const {Logout} = UserDataManager()

    return (
        <Link className={props.className} onClick={Logout} to="/" style={{"textDecoration": "none", "fontSize": "20px", "color": "white"}}>
            Wyloguj
        </Link>
    )
}

export const UgPageLink = (props:Props) => {
    return (
        <a className={props.className + " navbar-brand pe-3 h-100 border-end"}
           href="https://ug.edu.pl/"
           title="Strona główna"
           rel="home">
            <img src={Logo} alt="Strona główna" className="d-inline align-top h-100"/>
        </a>
    )
}