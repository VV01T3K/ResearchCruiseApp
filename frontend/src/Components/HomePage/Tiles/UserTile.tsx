import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
function UserTile( props:{ setAuth}){
    return (
        <Tile>
            <div>
                <Link to={""} onClick={()=>props.setAuth(null)}> Logout </Link>
            </div>
        </Tile>
    )
}

export default UserTile