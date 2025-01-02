import CruisesTile from '@components/MainPageMenu/Tiles/CruisesTile';
import CruiseApplicationsTile from '@components/MainPageMenu/Tiles/CruiseApplicationsTile';
import ManageUserTile from '@components/MainPageMenu/Tiles/ManageUserTile';
import AccountSettingsTile from '@components/MainPageMenu/Tiles/AccountSettingsTile';
import NewCruiseApplicationTile from '@components/MainPageMenu/Tiles/NewCruiseApplicationTile';
import {HelpInformationTile} from '@components/MainPageMenu/Tiles/HelpInformationTile';
import {PriorityInformationTile} from '@components/MainPageMenu/Tiles/PriorityInformationTile';
import MyPublicationsTile from '@components/MainPageMenu/Tiles/MyPublicationTile';
import CruiseEffectsTile from '@components/MainPageMenu/Tiles/CruiseEffectsTile';

const shipownerPanelTiles = () => [
    { element: <CruisesTile />, cols: 2, rows: 2 },
    { element: <CruiseApplicationsTile />, cols: 1, rows: 2 },
    { element: <ManageUserTile />, cols: 2, rows: 1 },
    { element: <AccountSettingsTile />, cols: 1, rows: 2 },
    { element: <NewCruiseApplicationTile />, cols: 1, rows: 1 },
    { element: <HelpInformationTile />, cols: 1, rows: 1 },
    { element: <PriorityInformationTile />, cols: 2, rows: 1 },
    { element: <MyPublicationsTile />, cols: 1, rows: 1 },
    { element: <CruiseEffectsTile/>, cols: 1, rows: 1 },
];

export default shipownerPanelTiles;
