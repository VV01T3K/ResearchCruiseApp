import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
import {Path as Path} from "../../../Tools/Path";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/gear-wide.svg"


function AccountSettingsTile(){
    return (
            <Tile>
                <Link to={Path.AccountSettings} className={"common-tile-link"}>
                    <Icon className={"bi-menu-common"}/>
                    Ustawienia konta
                </Link>
            </Tile>
    )
}


export default AccountSettingsTile