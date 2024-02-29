import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
function UserTile(){
    return (
        <Tile>
            <div>
                <Link to={""} onClick={()=>{}}> Logout </Link>
            </div>
        </Tile>
    )
}

export default UserTile