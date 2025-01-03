import { Path } from "../../../ToBeMoved/Tools/Path"
import { TileWrapper } from "@components/MainPageMenu/Tiles/TileWrapper"
import Icon from "bootstrap-icons/icons/info-lg.svg?react"

export const HelpInformationTile = () => (
  <TileWrapper path={Path.HelpInformation} label={"Pomoc"}>
    <Icon className={"bi-menu-common"} />
  </TileWrapper>
)
