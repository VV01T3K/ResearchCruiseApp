import file_icon from "../../../resources/file_icon.png";
import React, {useRef, useState} from "react";
import {ControllerRenderProps} from "react-hook-form";
import app from "../../App";


type Props = {
    field: any,
    id: string,
    form
}


export default function FilePicker(props: Props) {
    const inputLabelRef = useRef(null)
    const [fileContent, setFileCon]

    return (
        <div className="d-flex flex-wrap justify-content-center">
            <input
                {...props.field}
                id={props.id}
                type="file"
                hidden
                onChange={e => {
                    if (e.target.files && e.target.files.length) {
                        const reader = new FileReader()
                        let fileContent
                        reader.onloadend = () => {
                            console.log(props.id)
                            fileContent = reader.result!.toString()
                        }
                        reader.readAsDataURL(e.target.files[0])
                        props.form.setValue(props.id, fileContent)
                    }
                }}
            />
            <label
                htmlFor={props.id}
                className="w-100 bg-light d-flex justify-content-center"
                style={{
                    cursor: "pointer"
                }}
            >
                <img
                    src={file_icon}
                    height="45px"
                    width="45px"
                    className="rounded-2 p-1 d-flex"
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
                className="text-center w-100 bg-light border-0 text-secondary"
                value="Brak"
                readOnly
            />
        </div>
    )
}