import React from 'react';
import { Path as Path } from '../../../ToBeMoved/Tools/Path';
import { ReactComponent as Icon } from '/node_modules/bootstrap-icons/icons/ui-radios.svg';
import { TileWrapper } from './TileWrapper';

const CruiseApplicationsTile = () => (
  <TileWrapper path={Path.CruiseApplications} label={'Zgłoszenia'}>
    <Icon className={'bi-menu-common'} />
  </TileWrapper>
);

export default CruiseApplicationsTile;
