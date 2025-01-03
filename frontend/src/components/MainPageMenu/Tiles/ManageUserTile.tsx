import { Path as Path } from "../../../ToBeMoved/Tools/Path"
import Icon from "/node_modules/bootstrap-icons/icons/people-fill.svg?react"
import { TileWrapper } from "./TileWrapper"

const ManageUserTile = () => (
  <TileWrapper path={Path.ManageUsers} label={"Zarządzanie użytkownikami"}>
    <Icon className={"bi-menu-common"} />
  </TileWrapper>
)

export default ManageUserTile
