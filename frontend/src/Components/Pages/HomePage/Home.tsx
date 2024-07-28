import React from 'react';
import Page from "../Page";


type Props = {
    children:
        React.ReactElement<any, string | React.JSXElementConstructor<any>>
}


function HomePage(props: Props){
    return (
        <>
            <Page className={"h-100"}>
                    {props.children}
            </Page>
        </>
    )
}


export default HomePage