import React from 'react';
import { Path as Path } from '../../../ToBeMoved/Tools/Path';
import { ReactComponent as Icon } from '/node_modules/bootstrap-icons/icons/floppy-fill.svg';
import { TileWrapper } from './TileWrapper';

const SavedCruiseApplicationsTile = () => (
  <TileWrapper path={Path.SavedApplications} label={'Zapisane zgłoszenia'}>
    <Icon className={'bi-menu-common'} />
  </TileWrapper>
);
export default SavedCruiseApplicationsTile;
