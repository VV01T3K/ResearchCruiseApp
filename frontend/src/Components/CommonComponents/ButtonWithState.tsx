import React from "react";
import {useNavigate} from "react-router-dom";
type Props = {
    to: string,
    state: any, // TODO: change type
    label: string,
    className?: string,
    style?: any // TODO: change type
}


export default function ButtonWithState(props: Props) {
    const navigate = useNavigate()

    return (
        <button
            className={props.className}
            style={props.style ?? { cursor: "pointer", fontSize: "inherit" }}
            onClick={() =>
                navigate(props.to, {
                    state: props.state
                })
            }
        >
            {props.label}
        </button>
    )
}