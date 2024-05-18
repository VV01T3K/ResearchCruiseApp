import React from "react";
import {useNavigate} from "react-router-dom";
import {FormPageLocationState} from "../Pages/FormPage/FormPage";

type Props = {
    to: string,
    state: any, // TODO: change type
    label: string,
    className?: string,
    style?: any // TODO: change type
}


export default function LinkWithState(props: Props) {
    const navigate = useNavigate()

    return (
        <a
            className={props.className ?? ""}
            style={props.style ?? { cursor: "pointer" }}
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