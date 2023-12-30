import React from 'react';
import CSSModules from 'react-css-modules';
import Style from './Page.css'
function Page(props:{className?: string, children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>}){
    return (
        <>
            <div className={"bg bgImage"}></div>
            <div className={"h-100 w-100 d-flex flex-column"}>
                <div className={"m-0 p-0 w-100 d-flex flex-row flex-shrink-0"} style={{"height": "84.3px"}}></div>
                <div className={"container-xxl  d-flex flex-column  p-2 overflow-auto "}>
                    <div className={props.className + " d-flex w-100 flex-row h-100  "}>
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