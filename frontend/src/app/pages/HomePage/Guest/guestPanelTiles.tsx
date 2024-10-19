import CruisesTile from '../../../../components/MainPageMenu/Tiles/CruisesTile';
import CruiseApplicationsTile from '../../../../components/MainPageMenu/Tiles/CruiseApplicationsTile';
import ManageUserTile from '../../../../components/MainPageMenu/Tiles/ManageUserTile';
import AccountSettingsTile from '../../../../components/MainPageMenu/Tiles/AccountSettingsTile';
import NewCruiseApplicationTile from '../../../../components/MainPageMenu/Tiles/NewCruiseApplicationTile';
import React from 'react';
import { PriorityInformationTile } from '@components/MainPageMenu/Tiles/PriorityInformationTile';
import { HelpInformationTile } from '@components/MainPageMenu/Tiles/HelpInformationTile';

const guestPanelTiles = () => [
    { element: <CruisesTile />, cols: 2, rows: 2 },
    { element: <CruiseApplicationsTile />, cols: 1, rows: 2 },
    { element: <PriorityInformationTile />, cols: 2, rows: 1 },
    { element: <HelpInformationTile />, cols: 2, rows: 1 },
    { element: <AccountSettingsTile />, cols: 1, rows: 2 },
];

export default guestPanelTiles;
