import Tile from './Tile';
import {Link} from 'react-router-dom';
import {Path as Path} from '../../../ToBeMoved/Tools/Path';
import Icon from 'bootstrap-icons/icons/plus-circle-fill.svg?react';

export default function NewCruiseApplicationTile() {
  return (
    <Tile>
      <Link
        state={{ formType: 'A' }}
        to={Path.Form}
        className={'common-tile-link'}
      >
        <Icon className={'bi-menu-common'} />
        Nowe zgłoszenie
      </Link>
    </Tile>
  );
}
