import { Path as Path } from "../../../ToBeMoved/Tools/Path"
import Icon from "bootstrap-icons/icons/ui-radios.svg?react"
import { TileWrapper } from "./TileWrapper"

const CruiseApplicationsTile = () => (
  <TileWrapper path={Path.CruiseApplications} label={"Zgłoszenia"}>
    <Icon className={"bi-menu-common"} />
  </TileWrapper>
)

export default CruiseApplicationsTile
