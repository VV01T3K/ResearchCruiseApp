import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
import {PathName as Path} from "../../../Tools/PathName";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/floppy-fill.svg"

function SavedApplicationsTile(){
    return (
        <Tile>
            <Link to={Path.SavedApplications} className={"common-tile-link"}>
                <Icon className={"bi-menu-common"}/>
                Zapisane zgłoszenia
            </Link>
        </Tile>
    )
}


export default SavedApplicationsTile;