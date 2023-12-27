import React  from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
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

export default CSSModules(UserTile, Style);