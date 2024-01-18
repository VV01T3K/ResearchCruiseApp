import React from 'react';
import Page from "../Tools/Page";
import Tiles from "./Tiles/TilesMenu";
import UserTile from "./Tiles/UserTile";
import NewFormTile from "./Tiles/NewFormTile";
import SavedFormsTile from "./Tiles/SavedFormsTile";
import FormsRequestsTile from "./Tiles/FormsRequestsTile";
import ManageUserTile from "./Tiles/ManageUserTile";
import MessagesTile from "./Tiles/MessagesTile";
import ViewFormsTile from "./Tiles/ViewFormsTile";


function HomePage(props:{className?: string, children}){


    return (
        <>
            <Page className={props.className + " justify-content-center "}>
                <div className=" d-flex flex-row pb-1 m-2 center align-self-start justify-content-center  w-100">
                    {props.children}
                </div>
            </Page>
        </>
    )
}

export default HomePage