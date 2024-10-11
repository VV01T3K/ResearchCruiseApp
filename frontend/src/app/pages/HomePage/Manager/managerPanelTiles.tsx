import NewCruiseApplicationTile from '../../../../components/MainPageMenu/Tiles/NewCruiseApplicationTile';
import CruiseApplicationsTile from '../../../../components/MainPageMenu/Tiles/CruiseApplicationsTile';
import AccountSettingsTile from '../../../../components/MainPageMenu/Tiles/AccountSettingsTile';
import CruisesTile from '../../../../components/MainPageMenu/Tiles/CruisesTile';
import React from 'react';

const managerPanelTiles = () => [
  { element: <NewCruiseApplicationTile />, cols: 2, rows: 2 },
  { element: <CruiseApplicationsTile />, cols: 2, rows: 1 },
  { element: <AccountSettingsTile />, cols: 1, rows: 2 },
  { element: <CruisesTile />, cols: 2, rows: 1 },
];

export default managerPanelTiles;
