import React from "react";




export default function StyleWrapper(props: {  }) {
    return (
        <div className={props.className + ` d-flex flex-column ${props.customError ? 'pb-0': ''} p-3 `}>

        </div>
    )
}
