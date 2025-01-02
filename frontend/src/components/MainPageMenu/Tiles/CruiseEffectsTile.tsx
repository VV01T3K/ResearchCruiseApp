import Icon from "/node_modules/bootstrap-icons/icons/award.svg?react"
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