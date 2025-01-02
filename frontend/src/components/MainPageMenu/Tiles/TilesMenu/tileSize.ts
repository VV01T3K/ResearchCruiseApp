import {TileType} from 'TileType';

export const tileSize = (tile: TileType) => ({
    colSpan: tile.cols,
    rowSpan: tile.rows,
});
