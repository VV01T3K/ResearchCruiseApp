import ReadOnlyTextInput from "../../../../CommonComponents/ReadOnlyTextInput";
import React from "react";

type Props = {
    title: string,
    children?:
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>[] |
        React.ReactElement<any, | string | React.JSXElementConstructor<HTMLElement>>,
}


export default function ApplicationInfoSection(props: Props) {
    return (
        <div className="d-flex col-12 col-xl-4 flex-wrap justify-content-center align-items-center p-2 border border-dark-subtle rounded-2 m-2">
            <div className="d-flex col-12 justify-content-center mb-1"><b>{props.title}:</b></div>
            {props.children}
        </div>
    )
}
