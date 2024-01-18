import React  from 'react';
import Tile from "./Tile";
function AccountSettingsTile(props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>}){
    return (
        <Tile>
            <div>
                <a href={"/AccountSettings"}>Ustawienia konta</a>
            </div>
        </Tile>
    )
}

export default AccountSettingsTile