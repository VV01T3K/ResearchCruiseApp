import Home from "./Home";
import SavedCruiseApplicationsTile from "./Tiles/SavedCruiseApplicationsTile";
import React from "react";
import TilesMenu from "./Tiles/TilesMenu";
import AccountSettingsTile from "./Tiles/AccountSettingsTile";


export default function ManagerPanel(){
    const tiles = [
        { element: <SavedCruiseApplicationsTile />, cols: 2, rows: 2 },
        { element: <AccountSettingsTile />, cols: 1, rows: 1 },
    ];

    return(
        <Home>
            <TilesMenu tiles={tiles} />
        </Home>
    )
}