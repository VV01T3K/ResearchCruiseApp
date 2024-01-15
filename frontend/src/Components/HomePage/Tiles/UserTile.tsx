import React  from 'react';
import Tile from "./Tile";
function UserTile( props:{ setUserToken:(userToken: string | null) => void}){
    return (
        <Tile>
            <div>
                <a href={"#"} onClick={()=>props.setUserToken(null)}> Logout </a>
            </div>
        </Tile>
    )
}

export default UserTile