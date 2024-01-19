import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
function ManageUserTile( ){
    return (
        <Tile>
            <div>
                <Link to={"/ManageUsers"}> Zarządzanie użytkownikami </Link>
            </div>
        </Tile>
    )
}

export default ManageUserTile