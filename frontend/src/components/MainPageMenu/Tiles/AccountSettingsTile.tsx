import React from 'react';
import { Path as Path } from '../../../ToBeMoved/Tools/Path';
import { ReactComponent as Icon } from '/node_modules/bootstrap-icons/icons/gear-wide.svg';
import { TileWrapper } from './TileWrapper';

const AccountSettingsTile = () => (
  <TileWrapper path={Path.AccountSettings} label={'Ustawienia konta'}>
    <Icon className={'bi-menu-common'} />
  </TileWrapper>
);

export default AccountSettingsTile;
