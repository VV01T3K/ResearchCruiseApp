import { Path as Path } from "../../../ToBeMoved/Tools/Path"
import Icon from "bootstrap-icons/icons/book.svg?react"
import { TileWrapper } from "../../MainPageMenu/Tiles/TileWrapper"

function MyPublicationsTile() {
  return (
    <TileWrapper path={Path.MyPublications} label={"Moje Publikacje"}>
      <Icon className={"bi-menu-common"} />
    </TileWrapper>
  )
}

export default MyPublicationsTile
