import file_icon from "../../../../resources/file_icon.png";
import React, {MouseEvent, useRef, useState} from "react";
import {FieldValues, useForm, UseFormReturn} from "react-hook-form";
import {ControllerRenderProps} from "react-hook-form";
import app from "../../../App";


type Props = {
    field: any,
    inputName: string,
    rowIdx: number,
    sectionName: string,
    fileFieldName: string,
    form: UseFormReturn
}


export default function FilePicker(props: Props) {
    const [fileName, setFileName] = useState("Brak")

    return (
        <div className="d-flex flex-wrap justify-content-center">
            <input
                {...props.field}
                id={props.inputName}
                type="file"
                hidden
                onChange={e => {
                    if (e.target.files && e.target.files.length) {
                        const reader = new FileReader()
                        const fileName = e.target.files[0].name

                        reader.onloadend = () => {
                            if (e.target.files) {
                                const fileContent = reader.result!.toString();
                                const formValues = props.form.getValues()

                                formValues[props.sectionName][props.rowIdx][props.fileFieldName].name = fileName
                                formValues[props.sectionName][props.rowIdx][props.fileFieldName].content = fileContent
                            }
                        }
                        reader.readAsDataURL(e.target.files[0])
                        setFileName(e.target.files[0].name)
                    }
                }}
            />
            <label
                htmlFor={props.inputName}
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
                    onMouseEnter={e => {
                        const thisImage = e.target as HTMLImageElement
                        thisImage.style.backgroundColor = "#eeeeee"
                    }}
                    onMouseLeave={e => {
                        const thisImage = e.target as HTMLImageElement
                        thisImage.style.backgroundColor = "#f8f8f8"
                    }}
                    alt="File picker icon"
                />
            </label>
            <input
                type="text"
                className="text-center w-100 bg-light border-0 text-secondary"
                value={fileName}
                readOnly
            />
        </div>
    )
}