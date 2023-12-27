import React from 'react';
import CSSModules from 'react-css-modules';
import Style from './Page.css'
function Page(props:{className?: string, children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>}){
    return (
        <>
            <div className={"bg bgImage"}></div>
            <div className={"h-100 w-100 d-flex flex-column"}>
                <div className={"m-0 p-0 w-100 d-flex flex-row flex-shrink-0"} style={{"height": "84.3px"}}></div>
                <div className={"container-xxl h-100 d-flex flex-column p-0 pt-2 pb-2"}>
                    <div className={props.className + " d-flex h-100 w-100 flex-row overflow-auto"}>
                        {/*<div className={" d-flex flex-row flex-nowrap "}>*/}
                            {props.children}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CSSModules(Page, Style);