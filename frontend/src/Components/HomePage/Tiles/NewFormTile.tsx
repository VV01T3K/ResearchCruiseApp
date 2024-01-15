import React  from 'react';
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

export default NewFormTile