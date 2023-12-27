import React  from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import Tile from "./Tile";
function NewFormTile( props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>}){
    return (
        <Tile>
            <div>
                <a href={"/newform"}> New form </a>
            </div>
        </Tile>
    )
}

export default CSSModules(NewFormTile, Style);