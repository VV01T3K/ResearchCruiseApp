import React from 'react';
import Style from './style.css'


type Props = {
    children?: React.ReactElement
}


function Tile(props: Props){
    return (
        <div className={Style + " text-center w-100 h-100 justify-content-center align-items-center "}>
            {props.children}
        </div>
    )
}


export default Tile