import React  from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import Tile from "./Tile";
function FormRequestsTile( ){
    return (
        <Tile>
            <div>
                <a href={"#"}> Request forms </a>
            </div>
        </Tile>
    )
}

export default CSSModules(FormRequestsTile, Style);