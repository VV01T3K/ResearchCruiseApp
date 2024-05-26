import React from "react";


type Props = {
    value: string
    className?: string
}


export default function ReadOnlyTextInput (props: Props) {
    return (
        <input
            type="text"
            className={"d-flex form-control text-center col-12 p-1 " + props.className}
            style={{fontSize: "inherit", cursor: "default"}}
            value={props.value}
            readOnly
        />
    )
}