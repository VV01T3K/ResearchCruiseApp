import React from 'react';
import CSSModules from 'react-css-modules';
import Style from './Page.css'
function Page(props:{className?: string, children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>}){
    return (
        <>
            <div className={"bg bgImage"}></div>
            <div className={"m-0 p-0"} style={{"height": "84.3px"}}></div>
            <div className={" container-xxl h-100 overflow-auto"}>
                <div className={props.className + " d-flex flex-row flex-nowrap"}>
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default CSSModules(Page, Style);