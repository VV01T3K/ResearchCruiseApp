import React  from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import Tile from "./Tile";
function ManageUserTile( ){
    return (
        <Tile>
            <div>
                <a href={"#"}> Manage Users </a>
            </div>
        </Tile>
    )
}

export default CSSModules(ManageUserTile, Style);