import { TileType } from '../../../../types/TileType';

export const tileSize = (tile: TileType) => ({
  colSpan: tile.cols,
  rowSpan: tile.rows,
});
