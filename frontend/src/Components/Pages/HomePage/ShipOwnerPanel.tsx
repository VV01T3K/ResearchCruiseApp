import Home from "./Home";
import UserTile from "./Tiles/UserTile";
import NewFormTile from "./Tiles/NewFormTile";
import SavedFormsTile from "./Tiles/SavedFormsTile";
import FormsRequestsTile from "./Tiles/FormsRequestsTile";
import ManageUserTile from "./Tiles/ManageUserTile";
import MessagesTile from "./Tiles/MessagesTile";
import ViewFormsTile from "./Tiles/ViewFormsTile";
import React from "react";
import Tiles from "./Tiles/TilesMenu";
import AccountSettingsTile from "./Tiles/AccountSettingsTile";


export default function ShipOwnerPanel() {

    const tilesMenu = [
        { element: <UserTile />, cols: 1, rows: 1 },
        { element: <NewFormTile />, cols: 1, rows: 1 },
        { element: <AccountSettingsTile />, cols: 1, rows: 1 },
        { element: <ManageUserTile />, cols: 1, rows: 1 },
    ];

    return(
        <Home>
            <Tiles tilesMenu={tilesMenu} />
        </Home>
    )
}