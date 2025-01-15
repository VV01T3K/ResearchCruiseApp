import { Path as Path } from "../../../ToBeMoved/Tools/Path"
import Icon from "bootstrap-icons/icons/calendar-check-fill.svg?react"
import { TileWrapper } from "./TileWrapper"

const CruisesTile = () => (
  <TileWrapper path={Path.Cruises} label={"Harmonogram rejsów"}>
    <Icon className={"bi-menu-common"} />
  </TileWrapper>
)

export default CruisesTile
