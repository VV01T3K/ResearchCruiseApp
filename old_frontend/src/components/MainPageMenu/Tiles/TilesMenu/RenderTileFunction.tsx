import { RenderTileFunction } from "react-tiles-dnd"
import { TileType } from "TileType"

export const renderTileFunction: RenderTileFunction<TileType> = ({ data }) => (
  <div className="p-2 h-100 w-100">{data.element}</div>
)
