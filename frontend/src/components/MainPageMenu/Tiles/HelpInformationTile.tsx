import { Path } from '../../../ToBeMoved/Tools/Path';
import { TileWrapper } from '@components/MainPageMenu/Tiles/TileWrapper';
import React from 'react';
import { ReactComponent as Icon } from '/node_modules/bootstrap-icons/icons/info-lg.svg';

export const HelpInformationTile = () =>
    <TileWrapper path={Path.HelpInformation} label={'Pomoc'}>
        <Icon className={'bi-menu-common'} />
    </TileWrapper>;

