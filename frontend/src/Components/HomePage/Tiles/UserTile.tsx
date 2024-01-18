import React  from 'react';
import Tile from "./Tile";
function UserTile( props:{ setAuth}){
    return (
        <Tile>
            <div>
                <a href={"#"} onClick={()=>props.setAuth(null)}> Logout </a>
            </div>
        </Tile>
    )
}

export default UserTile