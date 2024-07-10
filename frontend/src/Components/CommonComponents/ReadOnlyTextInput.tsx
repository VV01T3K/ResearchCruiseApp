import React from "react";


type Props = {
    value: string
    className?: string
}


export default function ReadOnlyTextInput (props: Props) {
    return (
        <div className={`d-flex ${props.className}`}>
            <input
                type="text"
                className="d-flex form-control text-center w-100 p-1"
                style={{fontSize: "inherit", cursor: "default"}}
                value={props.value}
                readOnly
            />
        </div>
    )
}