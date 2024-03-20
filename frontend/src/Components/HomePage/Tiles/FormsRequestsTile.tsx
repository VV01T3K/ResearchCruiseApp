import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";


function FormRequestsTile(){
    return (
        <Tile>
            <div>
                <Link to="/FormRequests"> Request forms </Link>
            </div>
        </Tile>
    )
}


export default FormRequestsTile