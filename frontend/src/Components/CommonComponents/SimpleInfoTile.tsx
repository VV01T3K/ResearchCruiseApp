import ReadOnlyTextInput from "./ReadOnlyTextInput";
import React from "react";

type Props = {
    title: string,
    children?:
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>[] |
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>,
    colsXl: number
}


export default function SimpleInfoTile(props: Props) {
    return (
        <div className={`d-flex col-12 col-xl-${props.colsXl} flex-wrap justify-content-center align-items-center p-2 border border-dark-subtle rounded-2 m-2`}>
            <div className="d-flex col-12 justify-content-center mb-2"><b>{props.title}:</b></div>
            {props.children}
        </div>
    )
}
