import React, {useState} from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import Page from "../Tools/Page";
function HomePage(props:{className?: string, setUserToken:(userToken: string | null) => void}){
    return (
        <>
            <Page className={props.className + " justify-content-center bg-success w-100"}>
             <div>
            <a href={"#"} onClick={()=>props.setUserToken(null)}>
                logout
            </a>
             </div>

            </Page>
        </>
    )
}

export default CSSModules(HomePage, Style);