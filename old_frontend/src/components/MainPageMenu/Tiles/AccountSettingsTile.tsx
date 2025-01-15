import { Path as Path } from "../../../ToBeMoved/Tools/Path"
import Icon from "bootstrap-icons/icons/gear-wide.svg?react"
import { TileWrapper } from "./TileWrapper"

const AccountSettingsTile = () => (
  <TileWrapper path={Path.AccountSettings} label={"Ustawienia konta"}>
    <Icon className={"bi-menu-common"} />
  </TileWrapper>
)

export default AccountSettingsTile
