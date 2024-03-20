import React  from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import Tile from "./Tile";
import {Link} from "react-router-dom";


function MessagesTile( ){
    return (
        <Tile>
            <div>
                <Link to="/Messages"> Messages </Link>
            </div>
        </Tile>
    )
}


export default MessagesTile