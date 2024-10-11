import { Path } from '../../../ToBeMoved/Tools/Path';
import { TileWrapper } from '@components/MainPageMenu/Tiles/TileWrapper';
import React from 'react';
import { ReactComponent as Icon } from '/node_modules/bootstrap-icons/icons/info-circle.svg';

export const PriorityInformationTile = () =>
    <TileWrapper path={Path.PriorityInformation} label={'Informacje o priorytetyzacji'}>
        <Icon className={'bi-menu-common'} />
    </TileWrapper>;

