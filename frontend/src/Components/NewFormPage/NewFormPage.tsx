import React from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import Page from "../Tools/Page";

function NewFormPage(props:{className?: string}){
    return (
        <>
            <Page className={props.className + " d-flex justify-content-center bg-white"}>
                <div className="  d-flex flex-column pb-1 m-2 center align-self-start justify-content-center  w-100">
                    <p>Wybierz formularz</p>
                    <a href={"/formA"}> formularz A</a>
                </div>
            </Page>
        </>
    )
}

export default CSSModules(NewFormPage, Style);