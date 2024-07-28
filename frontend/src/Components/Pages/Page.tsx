import React, {useEffect, useState} from 'react';
import UserDataManager from "../CommonComponents/UserDataManager";
type Props = {
    className?: string,
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>
}

function Page(props: Props) {
    return (
        <>
            <div className="page">
                <div className="page-header-spacing"/>
                <div className="page-content-container">
                    <div className={props.className + " page-content"}>
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    )
}


export default Page