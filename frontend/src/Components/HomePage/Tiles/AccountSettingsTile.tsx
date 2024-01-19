import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";
function AccountSettingsTile(props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>}){
    return (
        <Tile>
            <div>
                <Link to={"/AccountSettings"}>Ustawienia konta</Link>
            </div>
        </Tile>
    )
}

export default AccountSettingsTile