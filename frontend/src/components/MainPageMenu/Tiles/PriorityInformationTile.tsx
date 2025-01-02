import {Path} from '../../../ToBeMoved/Tools/Path';
import {TileWrapper} from '@components/MainPageMenu/Tiles/TileWrapper';
import Icon from 'bootstrap-icons/icons/info-circle.svg?react';

export const PriorityInformationTile = () =>
    <TileWrapper path={Path.PriorityInformation} label={'Informacje o priorytetyzacji'}>
        <Icon className={'bi-menu-common'} />
    </TileWrapper>;

