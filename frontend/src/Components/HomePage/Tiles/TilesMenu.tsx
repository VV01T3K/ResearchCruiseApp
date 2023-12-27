import React from "react";
import "./style.css";
import "/node_modules/react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";
import Tile from "./Tile";
import UserTile from "./UserTile";
import NewFormTile from "./NewFormTile";
import SavedFormsTile from "./SavedFormsTile";
import FormsRequestsTile from "./FormsRequestsTile";
import ManageUserTile from "./ManageUserTile";
import MessagesTile from "./MessagesTile";
import ViewFormsTile from "./ViewFormsTile";


export default function TilesComponent(props:{ setUserToken:(userToken: string | null) => void}) {

    const tilesMenu = [
        { element: <UserTile setUserToken={props.setUserToken}/>, cols: 1, rows: 1 },
        { element:<NewFormTile/>, cols: 1, rows: 1 },
        { element: <SavedFormsTile/>, cols: 2, rows: 2 },
        { element: <FormsRequestsTile/>, cols: 2, rows: 2 },
        { element: <ManageUserTile/>, cols: 1, rows: 1 },
        { element: <MessagesTile/>, cols: 1, rows: 1 },
        { element: <ViewFormsTile/>, cols: 1, rows: 1 },
        { element: "Tile 8", cols: 1, rows: 1 },
        { element: "Tile 9", cols: 2, rows: 1 },
    ];

    const render: RenderTileFunction<typeof tilesMenu[0]> = ({ data, isDragging }) => (
        <div className={"p-2 w-100 h-100 d-flex "}>
            <div
                className={`tile bg-white h-100 w-100 ${isDragging ? "dragging" : ""}`} style={{color:"#052d73"}}>
                {data.element}
            </div>
        </div>
    );

    const tileSize = (tile: typeof tilesMenu[0]) => ({
        colSpan: tile.cols,
        rowSpan: tile.rows,
    });




    return (
        <div className={"tileContainer"} style={{ display: "flex", justifyContent: "center" }}>

            <TilesContainer
                data={tilesMenu}
                renderTile={render}
                tileSize={tileSize}
                forceTileWidth={150}
                forceTileHeight={150}
                style={{ justifyContent: "center" }}
            ></TilesContainer>
        </div>
    );
}
