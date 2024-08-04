import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
import {PathName as Path} from "../../../Tools/PathName";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/ui-radios.svg"

export default function CruiseApplicationsTile(){
    return (
        <Tile>
            <Link to={Path.CruiseApplications} className={"common-tile-link"}>
                <Icon className={"bi-menu-common"}/>
                Zgłoszenia
            </Link>
        </Tile>
    )
}
