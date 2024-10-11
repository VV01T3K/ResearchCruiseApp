import React from 'react';
import { Path as Path } from '../../../ToBeMoved/Tools/Path';
import { ReactComponent as Icon } from '/node_modules/bootstrap-icons/icons/calendar-check-fill.svg';
import { TileWrapper } from './TileWrapper';

const CruisesTile = () => (
  <TileWrapper path={Path.Cruises} label={'Harmonogram rejsów'}>
    <Icon className={'bi-menu-common'} />
  </TileWrapper>
);

export default CruisesTile;
