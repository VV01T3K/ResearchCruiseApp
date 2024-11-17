import React from "react";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/award.svg"
import {Path} from "../../../ToBeMoved/Tools/Path";
import {TileWrapper} from "../../MainPageMenu/Tiles/TileWrapper";

function MyPublicationsTile(){
    return (
        <TileWrapper path={Path.CruiseEffects} label={'Efekty rejsów'}>
            <Icon className={'bi-menu-common'} />
        </TileWrapper>
    )
}

export default MyPublicationsTile;