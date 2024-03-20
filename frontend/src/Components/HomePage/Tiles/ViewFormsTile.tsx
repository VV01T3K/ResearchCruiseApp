import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";


function ViewFormsTile(){
    return (
        <Tile>
            <div>
                <Link to="/ViewForms"> View forms </Link>
            </div>
        </Tile>
    )
}


export default ViewFormsTile