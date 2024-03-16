import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";


type Props = {
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>
}


function NewFormTile( props: Props){
    return (
        <Tile>
            <div>
                <Link to="/NewForm"> New form </Link>
            </div>
        </Tile>
    )
}


export default NewFormTile