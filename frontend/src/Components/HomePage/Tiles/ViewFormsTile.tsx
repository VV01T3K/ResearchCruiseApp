import React  from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import Tile from "./Tile";
function ViewFormsTile( ){
    return (
        <Tile>
            <div>
                <a href={"#"}> View forms </a>
            </div>
        </Tile>
    )
}

export default CSSModules(ViewFormsTile, Style);