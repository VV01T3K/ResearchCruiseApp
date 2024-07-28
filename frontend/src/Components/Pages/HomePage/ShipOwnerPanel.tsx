import Home from "./Home";
import ManageUserTile from "./Tiles/ManageUserTile";
import React from "react";
import TilesMenu from "./Tiles/TilesMenu";
import AccountSettingsTile from "./Tiles/AccountSettingsTile";


export default function ShipOwnerPanel() {

    const tiles = [
        { element: <AccountSettingsTile />, cols: 1, rows: 1 },
        { element: <ManageUserTile />, cols: 1, rows: 1 },
    ];

    return(
        <Home>
            <TilesMenu tiles={tiles} />
        </Home>
    )
}