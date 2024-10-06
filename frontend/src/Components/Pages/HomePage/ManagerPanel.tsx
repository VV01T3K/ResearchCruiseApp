import Home from "./Home";
import SavedCruiseApplicationsTile from "./Tiles/SavedCruiseApplicationsTile";
import React from "react";
import TilesMenu from "./Tiles/TilesMenu";
import AccountSettingsTile from "./Tiles/AccountSettingsTile";
import NewCruiseApplicationTile from "./Tiles/NewCruiseApplicationTile";
import ManageUserTile from "./Tiles/ManageUserTile";
import CruiseApplicationsTile from "./Tiles/CruiseApplicationsTile";
import CruisesTile from "./Tiles/CruisesTile";


export default function ManagerPanel(){
    const tiles = [
        { element: <NewCruiseApplicationTile />, cols: 2, rows: 2 },
        { element: <CruiseApplicationsTile />, cols: 2, rows: 1},
        { element: <AccountSettingsTile />, cols: 1, rows: 2 },
        { element: <CruisesTile />, cols: 2, rows: 1 }
    ];

    return(
        <Home>
            <TilesMenu tiles={tiles} />
        </Home>
    )
}