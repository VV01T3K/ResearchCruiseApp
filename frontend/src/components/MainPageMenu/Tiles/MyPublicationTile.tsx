import {Path as Path} from '../../../ToBeMoved/Tools/Path';
import React from "react";
import {ReactComponent as Icon} from "/node_modules/bootstrap-icons/icons/book.svg"
import {TileWrapper} from "../../MainPageMenu/Tiles/TileWrapper";

function MyPublicationsTile(){
    return (
        <TileWrapper path={Path.MyPublications} label={'Moje Publikacje'}>
            <Icon className={'bi-menu-common'} />
        </TileWrapper>
    )
}

export default MyPublicationsTile;
