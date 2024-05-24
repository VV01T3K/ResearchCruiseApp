import React from "react";
import tilesDndStyle from "/node_modules/react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";


type Props = {
    tilesMenu
}


export default function TilesComponent(props: Props) {
    const render: RenderTileFunction<typeof props.tilesMenu[0]> = ({ data, isDragging }) => (
        <div className="p-2 w-100 h-100 d-flex">
            <div className={`tile bg-white h-100 w-100 text-dark  ${isDragging ? "dragging" : ""}`}
            >
                {data.element}
            </div>
        </div>
    );

    const tileSize = (tile: typeof props.tilesMenu[0]) => ({
        colSpan: tile.cols,
        rowSpan: tile.rows,
    });

    return (
        <div className="tileContainer bg-primary bg-opacity-25" style={{display: "flex", justifyContent: "center"}}>
            <TilesContainer
                className={tilesDndStyle}
                data={props.tilesMenu}
                disabled={true}
                renderTile={render}
                tileSize={tileSize}
                forceTileWidth={150}
                forceTileHeight={150}
                style={{justifyContent: "center"}}
            />
        </div>
    );
}
