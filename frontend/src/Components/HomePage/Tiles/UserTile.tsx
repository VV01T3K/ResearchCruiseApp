import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
import useCustomEvent from "../../Tools/useCustomEvent";


function UserTile(){
    const { dispatchEvent } = useCustomEvent('logoutSuccessful');
    return (
        <Tile>
            <div>
                <Link to="" onClick={()=> { dispatchEvent(null)} }> Logout </Link>
            </div>
        </Tile>
    )
}


export default UserTile