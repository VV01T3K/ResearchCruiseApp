import React from 'react';
import { Path as Path } from '../../../ToBeMoved/Tools/Path';
import { ReactComponent as Icon } from '/node_modules/bootstrap-icons/icons/people-fill.svg';
import { TileWrapper } from './TileWrapper';

const ManageUserTile = () => (
  <TileWrapper path={Path.ManageUsers} label={'Zarządzanie użytkownikami'}>
    <Icon className={'bi-menu-common'} />
  </TileWrapper>
);

export default ManageUserTile;
