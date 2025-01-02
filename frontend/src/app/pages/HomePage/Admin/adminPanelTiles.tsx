import NewCruiseApplicationTile from '@components/MainPageMenu/Tiles/NewCruiseApplicationTile';
import ManageUserTile from '@components/MainPageMenu/Tiles/ManageUserTile';
import AccountSettingsTile from '@components/MainPageMenu/Tiles/AccountSettingsTile';
import CruiseApplicationsTile from '@components/MainPageMenu/Tiles/CruiseApplicationsTile';
import CruisesTile from '@components/MainPageMenu/Tiles/CruisesTile';
import MyPublicationsTile from '@components/MainPageMenu/Tiles/MyPublicationTile';
import CruiseEffectsTile from '@components/MainPageMenu/Tiles/CruiseEffectsTile';
import {PriorityInformationTile} from "@components/MainPageMenu/Tiles/PriorityInformationTile";
import {HelpInformationTile} from "@components/MainPageMenu/Tiles/HelpInformationTile";

export const adminPanelTiles = () => [
    { element: <NewCruiseApplicationTile />, cols: 2, rows: 2 },
    { element: <PriorityInformationTile />, cols: 2, rows: 1 },
    { element: <ManageUserTile />, cols: 1, rows: 1 },
    { element: <AccountSettingsTile />, cols: 1, rows: 1 },
    { element: <CruiseApplicationsTile />, cols: 1, rows: 1 },
    { element: <CruisesTile />, cols: 2, rows: 1 },
    { element: <HelpInformationTile />, cols: 1, rows: 1 },
    { element: <MyPublicationsTile />, cols: 1, rows: 1 },
    { element: <CruiseEffectsTile/>, cols: 1, rows: 1 },

];
