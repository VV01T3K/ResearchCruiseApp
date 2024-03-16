import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";


type Props = {
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>
}


function AccountSettingsTile(props: Props){
    return (
        <Tile>
            <div>
                <Link to="/AccountSettings">Ustawienia konta</Link>
            </div>
        </Tile>
    )
}


export default AccountSettingsTile