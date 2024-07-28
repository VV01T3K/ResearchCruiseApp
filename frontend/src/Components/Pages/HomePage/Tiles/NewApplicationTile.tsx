import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
import {PathName as Path} from "../../../Tools/PathName";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/plus-circle-fill.svg"

function NewApplicationTile(){
    return (
        <Tile>
            <Link state={{formType: "A"}} to={Path.Form} className={"common-tile-link"}>
                <Icon className={"bi-menu-common"}/>
                Nowe zgłoszenie
            </Link>
        </Tile>
    )
}


export default NewApplicationTile