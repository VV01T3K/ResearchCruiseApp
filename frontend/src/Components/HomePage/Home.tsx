import React from 'react';
import Page from "../Tools/Page";


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