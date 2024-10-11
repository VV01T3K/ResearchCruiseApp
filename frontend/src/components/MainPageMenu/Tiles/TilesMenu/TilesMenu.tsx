import React from 'react';
import tilesDndStyle from '/node_modules/react-tiles-dnd/esm/index.css';
import { TilesContainer } from 'react-tiles-dnd';
import { renderTileFunction } from './RenderTileFunction';
import { tileSize } from './tileSize';
import { TileType } from '../../../../types/TileType';

type Props = {
  tiles: TileType[];
};

const TilesMenu = (props: Props) => (
  <div className={'tiles-container ' + tilesDndStyle}>
    <TilesContainer
      data={props.tiles}
      disabled={true}
      renderTile={renderTileFunction}
      tileSize={tileSize}
      forceTileWidth={150}
      forceTileHeight={150}
    />
  </div>
);

export default TilesMenu;
