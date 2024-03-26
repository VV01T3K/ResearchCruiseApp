import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";


function FormRequestsTile(){
    return (
        <Tile>
            <Link to="/FormRequests"  className={"p-3 d-flex flex-column w-100 h-100 align-items-center text-decoration-none"}>
                <svg xmlns="http://www.w3.org/2000/svg"  fill="black"
                     className="bi bi-chat-fill p-2" viewBox="0 0 16 16">
                    <path d="M10 0a2 2 0 1 1-4 0H3.5A1.5 1.5 0 0 0 2 1.5v13A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0zM4.5 5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1m0 2h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1"/>                </svg>
                Do uzupełnienia
            </Link>
        </Tile>
    )
}


export default FormRequestsTile