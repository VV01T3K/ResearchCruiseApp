import React from "react";
import tilesDndStyle from "/node_modules/react-tiles-dnd/esm/index.css";
import { TilesContainer, RenderTileFunction } from "react-tiles-dnd";

type TileType = {
    rows: number;
    cols: number;
    element: React.ReactNode;
}

type Props = {
    tiles: TileType[];
}



export default function TilesMenu(props: Props) {
    const render: RenderTileFunction<TileType> = ({ data }) => (
        <div className="p-2 h-100 w-100">
                {data.element}
        </div>
    );

    const tileSize = (tile: typeof props.tiles[0]) => ({
        colSpan: tile.cols,
        rowSpan: tile.rows,
    });

    return (
        <div className={"tiles-container " + tilesDndStyle}>
            <TilesContainer
                data={props.tiles}
                disabled={true}
                renderTile={render}
                tileSize={tileSize}
                forceTileWidth={150}
                forceTileHeight={150}
            />
        </div>
    );
}
