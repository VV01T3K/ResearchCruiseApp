import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
import {PathName as Path} from "../../../Tools/PathName";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/ui-radios.svg"

function ApplicationsTile(){
    return (
        <Tile>
            <Link to={Path.Applications} className={"common-tile-link"}>
                <Icon className={"bi-menu-common"}/>
                Zgłoszenia
            </Link>
        </Tile>
    )
}


export default CruiseApplicationsTile