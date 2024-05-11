import React from 'react';
import Page from "../Page";


type Props = {
    className?: string,
    children:
        string | number | boolean | null | undefined |
        React.ReactElement<any, string | React.JSXElementConstructor<any>> |
        Iterable<React.ReactNode> |
        React.ReactPortal
}


function HomePage(props: Props){
    return (
        <>
            <Page className={props.className + " justify-content-center"}>
                <div className="d-flex flex-row pb-1 m-2 center align-self-start justify-content-center w-100">
                    {props.children}
                </div>
            </Page>
        </>
    )
}


export default HomePage