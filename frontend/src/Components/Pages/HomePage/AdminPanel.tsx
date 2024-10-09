import Home from "./Home";
import SavedCruiseApplicationsTile from "./Tiles/SavedCruiseApplicationsTile";
import ManageUserTile from "./Tiles/ManageUserTile";
import React from "react";
import TilesMenu from "./Tiles/TilesMenu";
import AccountSettingsTile from "./Tiles/AccountSettingsTile";
import CruisesTile from "./Tiles/CruisesTile";
import CruiseApplicationsTile from "./Tiles/CruiseApplicationsTile";
import NewCruiseApplicationTile from "./Tiles/NewCruiseApplicationTile";
import PriorityInformationTile from "./Tiles/PriorityInformationTile";


export default function AdminPanel() {
    const tiles = [
        { element: <NewCruiseApplicationTile />, cols: 2, rows: 2 },
        { element: <SavedCruiseApplicationsTile />, cols: 2, rows: 1 },
        { element: <ManageUserTile />, cols: 1, rows: 1 },
        { element: <PriorityInformationTile/>, cols: 1, rows: 1 },
        { element: <CruiseApplicationsTile />, cols: 1, rows: 1},
        { element: <CruisesTile />, cols: 2, rows: 1 },
        { element: <AccountSettingsTile/>, cols: 1, rows: 1 }
    ];

    return(
        <Home>
            <TilesMenu tiles={tiles} />
        </Home>
    )
}