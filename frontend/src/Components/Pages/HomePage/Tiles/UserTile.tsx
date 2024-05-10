import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
import useCustomEvent from "../../../Tools/useCustomEvent";


function UserTile(){
    const { dispatchEvent } = useCustomEvent('logoutSuccessful');
    return (
        <Link to="/ViewForms"  className={"p-3 d-flex flex-column w-100 h-100 align-items-center text-decoration-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="black"
                 className="bi bi-chat-fill p-2" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
            Użytkownik
        </Link>
    )
}


export default UserTile