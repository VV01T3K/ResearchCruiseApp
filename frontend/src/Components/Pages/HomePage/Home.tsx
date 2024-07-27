import React from 'react';
import Page from "../Page";


type Props = {
    className?: string,
    children:
        React.ReactElement<any, string | React.JSXElementConstructor<any>>
}


function HomePage(props: Props){
    return (
        <>
            <Page className={props.className + " d-flex flex-row pb-1 m-2 center align-self-start justify-content-center w-100"}>
                    {props.children}
            </Page>
        </>
    )
}


export default HomePage