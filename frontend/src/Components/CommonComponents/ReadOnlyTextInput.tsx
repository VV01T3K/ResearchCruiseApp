import React from "react";


type Props = {
    value: string
}


export default function ReadOnlyTextInput (props: Props) {
    return (
        <input
            type="text"
            className="d-flex form-control text-center col-12 p-1"
            style={{fontSize: "inherit"}}
            value={props.value}
            readOnly
        />
    )
}