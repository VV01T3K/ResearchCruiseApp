import NewCruiseApplicationTile from "@components/MainPageMenu/Tiles/NewCruiseApplicationTile"
import CruiseApplicationsTile from "@components/MainPageMenu/Tiles/CruiseApplicationsTile"
import AccountSettingsTile from "@components/MainPageMenu/Tiles/AccountSettingsTile"
import CruisesTile from "@components/MainPageMenu/Tiles/CruisesTile"
import { PriorityInformationTile } from "@components/MainPageMenu/Tiles/PriorityInformationTile"
import { HelpInformationTile } from "@components/MainPageMenu/Tiles/HelpInformationTile"
import MyPublicationsTile from "@components/MainPageMenu/Tiles/MyPublicationTile"
import CruiseEffectsTile from "@components/MainPageMenu/Tiles/CruiseEffectsTile"

const managerPanelTiles = () => [
  { element: <NewCruiseApplicationTile />, cols: 2, rows: 2 },
  { element: <CruiseApplicationsTile />, cols: 2, rows: 1 },
  { element: <PriorityInformationTile />, cols: 1, rows: 1 },
  { element: <AccountSettingsTile />, cols: 1, rows: 2 },
  { element: <CruisesTile />, cols: 2, rows: 1 },
  { element: <HelpInformationTile />, cols: 1, rows: 1 },
  { element: <MyPublicationsTile />, cols: 1, rows: 1 },
  { element: <CruiseEffectsTile />, cols: 1, rows: 1 },
]

export default managerPanelTiles
