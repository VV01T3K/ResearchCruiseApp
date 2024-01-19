import React from 'react';
import Page from "../Tools/Page";
import {Link} from "react-router-dom";

function NewFormPage(props:{className?: string}){
    return (
        <>
            <Page className={props.className + " d-flex justify-content-center bg-white"}>
                <div className="  d-flex flex-column pb-1 m-2 center align-self-start justify-content-center  w-100">
                    <p>Wybierz formularz</p>
                    <Link to={"/formA"}> formularz A</Link>
                    <Link to={"/formB"}> formularz B</Link>
                    <Link to={"/formC"}> formularz C</Link>
                </div>
            </Page>
        </>
    )
}

export default NewFormPage;