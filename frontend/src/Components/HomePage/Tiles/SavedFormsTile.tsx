import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";


function SavedFormsTile(){
    return (
        <Tile>
            <div>
                <Link to="/SavedForms"> Saved forms </Link>
            </div>
        </Tile>
    )
}


export default SavedFormsTile;