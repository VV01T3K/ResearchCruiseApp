import 'react-tiles-dnd/esm/index.css';
import {TilesContainer} from 'react-tiles-dnd';
import {renderTileFunction} from './RenderTileFunction';
import {tileSize} from './tileSize';
import {TileType} from 'TileType';

type Props = {
    tiles: TileType[];
};

const TilesMenu = (props: Props) => (
    <div className={'tiles-container'}>
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
