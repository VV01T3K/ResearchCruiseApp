import Tile from './Tile';
import {Link} from 'react-router-dom';
import React from 'react';

export const TileWrapper = (props: {
  path: string;
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <Tile>
      <Link to={props.path} className={'common-tile-link'}>
        {props.children}
        {props.label}
      </Link>
    </Tile>
  );
};
