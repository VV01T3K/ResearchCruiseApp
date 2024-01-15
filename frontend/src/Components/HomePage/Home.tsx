import React from 'react';
import Page from "../Tools/Page";
import Tiles from "./Tiles/TilesMenu";

function HomePage(props:{className?: string, setUserToken:(userToken: string | null) => void}){
    return (
        <>
            <Page className={props.className + " justify-content-center "}>
                <div className=" d-flex flex-row pb-1 m-2 center align-self-start justify-content-center  w-100">
                    <Tiles setUserToken={props.setUserToken}/>
                </div>
            </Page>
        </>
    )
}

export default HomePage