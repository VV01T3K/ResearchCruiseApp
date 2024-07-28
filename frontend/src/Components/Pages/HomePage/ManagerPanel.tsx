import Home from "./Home";
import SavedApplicationsTile from "./Tiles/SavedApplicationsTile";
import React from "react";
import TilesMenu from "./Tiles/TilesMenu";
import AccountSettingsTile from "./Tiles/AccountSettingsTile";


export default function ManagerPanel(){
    const tiles = [
        { element: <SavedApplicationsTile />, cols: 2, rows: 2 },
        { element: <AccountSettingsTile />, cols: 1, rows: 1 },
    ];

    return(
        <Home>
            <TilesMenu tiles={tiles} />
        </Home>
    )
}