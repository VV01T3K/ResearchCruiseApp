import React, {useState} from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
function Tile( props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>}){
    return (
        <div className={" "}>

            {props.children}
        </div>
    )
}

export default CSSModules(Tile, Style);