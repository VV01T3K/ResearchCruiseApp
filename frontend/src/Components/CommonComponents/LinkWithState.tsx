import React from "react";
import {useNavigate} from "react-router-dom";
import {Buffer} from "buffer";

type Props = {
    to: string,
    state: any, // TODO: change type
    label: string,
    className?: string,
    style?: any // TODO: change type
    disabled?:boolean
    useWindow?:boolean
}


export default function LinkWithState(props: Props) {
    const navigate = useNavigate()

    return (
        <a
            className={!props.disabled ? "link-with-state" : "link-with-state-disabled"}
            onClick={() =>{
                if(!props.disabled) {
                    if(props.useWindow){
                        const param = Buffer.from(JSON.stringify(props.state)).toString("base64")
                        console.log(props.state)
                        // temporary
                        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                            width=0,height=0,left=-1000,top=-1000`;
                        window.open(props.to + "?data="+param, "_blank", params)
                    }
                    else
                        navigate(props.to, {
                                state: props.state
                        })
                }
            }
            }
        >
            {props.label}
        </a>
    )
}