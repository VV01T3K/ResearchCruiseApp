import React from 'react';
type Props = {
    className?: string,
    children?: React.ReactElement[] | React.ReactElement
}

function Page(props: Props) {
    return (
        <div className="page">
            <div className="page-header-spacing"/>
            <div className="page-content-container">
                <div className={props.className + " page-content"}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}


export default Page