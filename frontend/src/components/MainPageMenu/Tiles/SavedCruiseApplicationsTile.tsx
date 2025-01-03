import { Path as Path } from "../../../ToBeMoved/Tools/Path"
import Icon from "bootstrap-icons/icons/floppy-fill.svg?react"
import { TileWrapper } from "./TileWrapper"

const SavedCruiseApplicationsTile = () => (
  <TileWrapper path={Path.SavedApplications} label={"Zapisane zgłoszenia"}>
    <Icon className={"bi-menu-common"} />
  </TileWrapper>
)
export default SavedCruiseApplicationsTile
