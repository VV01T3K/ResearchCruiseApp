import React from 'react';
import CruisesTile from '@components/MainPageMenu/Tiles/CruisesTile';
import CruiseApplicationsTile from '@components/MainPageMenu/Tiles/CruiseApplicationsTile';
import AccountSettingsTile from '@components/MainPageMenu/Tiles/AccountSettingsTile';
import { PriorityInformationTile } from '@components/MainPageMenu/Tiles/PriorityInformationTile';
import { HelpInformationTile } from '@components/MainPageMenu/Tiles/HelpInformationTile';
import MyPublicationsTile from '@components/MainPageMenu/Tiles/MyPublicationTile';
import CruiseEffectsTile from '@components/MainPageMenu/Tiles/CruiseEffectsTile';

const guestPanelTiles = () => [
    { element: <CruisesTile />, cols: 2, rows: 2 },
    { element: <CruiseApplicationsTile />, cols: 1, rows: 2 },
    { element: <PriorityInformationTile />, cols: 2, rows: 1 },
    { element: <HelpInformationTile />, cols: 2, rows: 1 },
    { element: <AccountSettingsTile />, cols: 1, rows: 2 },
    { element: <MyPublicationsTile />, cols: 1, rows: 1 },
    { element: <CruiseEffectsTile/>, cols: 1, rows: 1 },
];

export default guestPanelTiles;
