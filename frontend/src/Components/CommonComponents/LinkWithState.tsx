import React from "react";
import {useNavigate} from "react-router-dom";

type Props = {
    to: string,
    state: any, // TODO: change type
    label: string,
    className?: string,
    style?: any // TODO: change type
    disabled?:boolean
}


export default function LinkWithState(props: Props) {
    const navigate = useNavigate()

    return (
        <a
            className={!props.disabled ? "link-with-state" : "link-with-state-disabled"}
            onClick={() =>{
                if(!props.disabled)
                    navigate(props.to, {
                            state: props.state
                    })
            }
            }
        >
            {props.label}
        </a>
    )
}