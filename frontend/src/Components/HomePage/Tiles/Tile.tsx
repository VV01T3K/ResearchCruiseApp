import React from 'react';
import Style from './style.css'


type Props = {
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>
}


function Tile(props: Props){
    return (
        <div className={Style + " text-center"}>
            {props.children}
        </div>
    )
}


export default Tile