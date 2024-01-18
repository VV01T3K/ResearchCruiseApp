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

export default function AdminPanel(props:{setAuth}){

    const tilesMenu = [
        { element: <UserTile setAuth={props.setAuth}/>, cols: 1, rows: 1 },
        { element:<NewFormTile/>, cols: 1, rows: 1 },
        { element: <SavedFormsTile/>, cols: 2, rows: 2 },
        { element: <FormsRequestsTile/>, cols: 2, rows: 2 },
        { element: <ManageUserTile/>, cols: 1, rows: 1 },
        { element: <MessagesTile/>, cols: 1, rows: 1 },
        { element: <ViewFormsTile/>, cols: 1, rows: 1 },
        { element: "Tile 8", cols: 1, rows: 1 },
        { element: "Tile 9", cols: 2, rows: 1 },
    ];

    return(
        <Home>
            <Tiles tilesMenu={tilesMenu}/>
        </Home>
    )
}