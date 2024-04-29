import React from "react";


type Props = {
    value: string
}


export default function ReadOnlyTextArea (props: Props) {
    return (
        <textarea
            className="d-flex form-control text-center col-12 p-1"
            style={{fontSize: "inherit"}}
            value={props.value}
            rows={1}
            readOnly
        />
    )
}