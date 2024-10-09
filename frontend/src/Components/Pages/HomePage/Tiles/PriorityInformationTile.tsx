import Tile from "./Tile";
import {Link} from "react-router-dom";
import {Path as Path} from "../../../Tools/Path";
import React from "react";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/info-circle.svg"

function PriorityInformationTile(){
    return (
        <Tile>
            <Link to={Path.PriorityInformation} className={"common-tile-link"}>
                <Icon className={"bi-menu-common"}/>
                Informacje o priorytetyzacji
            </Link>
        </Tile>
    )
}

export default PriorityInformationTile;