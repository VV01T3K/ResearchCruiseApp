import React  from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import Tile from "./Tile";
function SavedFormsTile( ){
    return (
        <Tile>
            <div>
                <a href={"#"}> Saved forms </a>
            </div>
        </Tile>
    )
}

export default CSSModules(SavedFormsTile, Style);