import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
import {Path as Path} from "../../../Tools/Path";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/floppy-fill.svg"

export default function SavedCruiseApplicationsTile(){
    return (
        <Tile>
            <Link to={Path.SavedApplications} className={"common-tile-link"}>
                <Icon className={"bi-menu-common"}/>
                Zapisane zgłoszenia
            </Link>
        </Tile>
    )
}