import React from "react";
import {useNavigate} from "react-router-dom";

type Props = {
    to: string,
    state: any,
    label: string
}


export default function LinkWithState(props: Props) {
    const navigate = useNavigate()

    return (
        <a
            className={`col-12 d-flex justify-content-center`}
            style={{cursor: "pointer"}}
            onClick={() =>
                navigate(props.to, {
                        state: props.state
                })
            }
        >
            {props.label}
        </a>
    )
}