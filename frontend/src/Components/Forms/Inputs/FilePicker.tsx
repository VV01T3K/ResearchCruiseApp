import file_icon from "../../../resources/file_icon.png";
import React, {useRef, useState} from "react";
import {ControllerRenderProps} from "react-hook-form";


type Props = {
    field: any,
    id: string
}


export default function FilePicker(props: Props) {
    const inputLabelRef = useRef(null)

    return (
        <>
            <input
                {...props.field}
                id={props.id}
                type="file"
                hidden
                onChange={e => {
                    if (e.target.files)
                        inputLabelRef.current!.value = e.target.files[0].name
                }}
            />
            <label
                htmlFor={props.id}
                className="d-flex justify-content-center w-100 bg-light"
                style={{
                    cursor: "pointer"
                }}
            >
                <img
                    src={file_icon}
                    height="45px"
                    width="45px"
                    className={`rounded-2 p-1 d-flex`}
                    onMouseEnter={e =>
                        e.target.style.backgroundColor = "#eeeeee"
                    }
                    onMouseLeave={e =>
                        e.target.style.backgroundColor = "#f8f8f8"
                    }
                    alt="File picker icon"
                />
            </label>
            <input
                type="text"
                ref={inputLabelRef}
                className="d-flex w-100 justify-content-center bg-light border-0"
                value="Brak"
                readOnly
            />
        </>
    )
}