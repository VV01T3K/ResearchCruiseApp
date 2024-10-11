import CruisesTile from '../../../../components/MainPageMenu/Tiles/CruisesTile';
import CruiseApplicationsTile from '../../../../components/MainPageMenu/Tiles/CruiseApplicationsTile';
import ManageUserTile from '../../../../components/MainPageMenu/Tiles/ManageUserTile';
import AccountSettingsTile from '../../../../components/MainPageMenu/Tiles/AccountSettingsTile';
import NewCruiseApplicationTile from '../../../../components/MainPageMenu/Tiles/NewCruiseApplicationTile';
import React from 'react';

const shipownerPanelTiles = () => [
  { element: <CruisesTile />, cols: 2, rows: 2 },
  { element: <CruiseApplicationsTile />, cols: 1, rows: 2 },
  { element: <ManageUserTile />, cols: 2, rows: 1 },
  { element: <AccountSettingsTile />, cols: 1, rows: 2 },
  { element: <NewCruiseApplicationTile />, cols: 2, rows: 1 },
];

export default shipownerPanelTiles;
