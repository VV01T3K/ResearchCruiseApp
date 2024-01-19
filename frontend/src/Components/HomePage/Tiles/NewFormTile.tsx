import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
function NewFormTile( props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>}){
    return (
        <Tile>
            <div>
                <Link to={"/NewForm"}> New form </Link>
            </div>
        </Tile>
    )
}

export default NewFormTile