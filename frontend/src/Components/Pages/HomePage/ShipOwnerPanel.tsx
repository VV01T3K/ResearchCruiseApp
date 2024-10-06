import Home from "./Home";
import ManageUserTile from "./Tiles/ManageUserTile";
import React from "react";
import TilesMenu from "./Tiles/TilesMenu";
import AccountSettingsTile from "./Tiles/AccountSettingsTile";
import NewCruiseApplicationTile from "./Tiles/NewCruiseApplicationTile";
import SavedCruiseApplicationsTile from "./Tiles/SavedCruiseApplicationsTile";
import CruiseApplicationsTile from "./Tiles/CruiseApplicationsTile";
import CruisesTile from "./Tiles/CruisesTile";


export default function ShipOwnerPanel() {

    const tiles = [
        { element: <CruisesTile />, cols: 2, rows: 2 },
        { element: <CruiseApplicationsTile />, cols: 1, rows: 2},

        { element: <ManageUserTile />, cols: 2, rows: 1 },
        { element: <AccountSettingsTile />, cols: 1, rows: 2 },
        { element: <NewCruiseApplicationTile />, cols: 2, rows: 1 },



    ];

    return(
        <Home>
            <TilesMenu tiles={tiles} />
        </Home>
    )
}